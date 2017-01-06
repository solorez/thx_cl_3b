/*
具备中枢且脱离中枢：
1. 判断当前pull周期价格是否一段时间period内高位，满足3买前提
2. 通过jump步进寻找前期最低点
3. 从最低点，通过tpart的向后步进，找中枢的4段
4. 计算中枢区间，以及对比pull区间MA值（CLOSE,HIGH都很难概括回调不是最低点的问题）

用法：
worked=100 > baseline=10 证明具备中枢且现脱离中枢向上
goodboy	根据数值观察走到程序哪一步

参数说明：
PULL		距离当前周期单位开始寻找中枢和低位			范围 3~30		最佳 15
PIEROD 		初始探测低位周期长度						范围 30~100		最佳 60
JUMP 		探测低位周期步进							范围 20~80		最佳 50
TPART 		从低位开始探测中枢的周期长度步进			范围 8~40		最佳 28
*/

// 判断switch
workswitch=0;		// worked
goodswitch=0;		// goodboy
baseline:20;

// 常量
// 没办法用动态步进 只能用tpart直接代替步进
MINiline= 5;
Linejump = TPART;
zslinehighbar = HHVBARS(HIGH, TPART);
zslinehighvalue = HHV(HIGH, TPART);
zslinelowbar = LLVBARS(LOW, TPART);
zslinelowvalue = LLV(LOW, TPART);

// 1. 判断当前pull周期价格是否一段时间period内高位，满足3买前提
// 用HIGH>CLOSE去比较可以过滤一些瞬间值
//IF(HIGH> REF(HHV(CLOSE, pierod), pull)) {
IF(HHV(HIGH,pull-1)> REF(HHV(HIGH, pierod), pull+1)) {
//IF(1){

	// 2. 通过jump步进寻找前期最低点
	pierodtmp = PIEROD;
	WHILE(LLV(LOW, pull + pierodtmp - JUMP) > LLV(LOW, pull + pierodtmp)) {
		pierodtmp = pierodtmp + JUMP;
	}
	// 低位位置
	Lbars= LLVBARS(LOW, pierodtmp + pull);

	workswitch=1;
}

// 3. 从最低点，通过tpart的向后步进，找中枢的4段
IF(ISNULL(Lbars) == 0) {
	// 第一段 找出高点 h1
	barbehind = Lbars - 2 * Linejump;
	barbefore = Lbars - Linejump;
	WHILE(REF(zslinehighvalue, barbehind) > REF(zslinehighvalue, barbefore)) {
		barbehind = barbehind - Linejump;
		barbefore = barbefore - Linejump;

	}
	workswitch=2.1;
	// 	循环失效证明前一个节点是对的
	IF(barbefore > 0) {
		Lbh1tmp = barbefore + REF(zslinehighbar, barbefore);
		workswitch= 2.3;
		// 中枢的一段总得有个4，5根K线吧
		IF(Lbars - Lbh1tmp > MINiline) {
			Lbh1= Lbh1tmp;
			workswitch= 2.9;
		} ELSE {
			workswitch= 2.4;
		}

	} ELSE {
		workswitch= 2.2;
	}

	// 第二段 找出低点 l1
	IF(ISNULL(Lbh1) == 0) {
		barbehind = Lbh1 - 2 * Linejump;
		barbefore = Lbh1 - Linejump;
		workswitch= 3.1;
		WHILE(REF(zslinelowvalue, barbehind) < REF(zslinelowvalue, barbefore)) {
			barbehind = barbehind - Linejump;
			barbefore = barbefore - Linejump;
		}
		IF(barbefore > 0) {
			Lbl1tmp = barbefore + REF(zslinelowbar, barbefore);
			workswitch= 3.3;
			IF(Lbh1 - Lbl1tmp > MINiline) {
				Lbl1= Lbl1tmp;
				workswitch= 3.9;
			} ELSE {
				workswitch= 3.4;
			}

		} ELSE {
			workswitch= 3.2;
		}

	} ELSE {
		workswitch= 3.0;
	}

	// 第三段 找出高点 h2
	IF(ISNULL(Lbl1) == 0) {
		//IF(1){
		barbehind = Lbl1 - 2 * Linejump;
		barbefore = Lbl1 - Linejump;
		workswitch= 4.1;
		WHILE(REF(zslinehighvalue, barbehind) > REF(zslinehighvalue, barbefore)) {
			barbehind = barbehind - Linejump;
			barbefore = barbefore - Linejump;
		}
		IF(barbefore > 0) {
			Lbh2tmp = barbefore + REF(zslinehighbar, barbefore);
			workswitch= 4.3;
			IF(Lbl1 - Lbh2tmp > MINiline) {
				Lbh2= Lbh2tmp;
				workswitch= 4.9;
			} ELSE {
				workswitch= 4.4;
			}

		} ELSE {
			workswitch= 4.2;
		}

	} ELSE {
		workswitch= 4.0;
	}

	// 第四段 找出低点 l2
	IF(ISNULL(Lbh2) == 0) {
		//IF(1){
		
		barbehind = Lbh2 - 2 * Linejump;
		barbefore = Lbh2 - Linejump;
		workswitch= 5.1;
		WHILE(REF(zslinelowvalue, barbehind) < REF(zslinelowvalue, barbefore)) {
			barbehind = barbehind - Linejump;
			barbefore = barbefore - Linejump;
		}
		
		// 第四段有时候会很短促，这里有特殊的处理以适应多种情况，需要斟酌 !!!
		IF(barbefore < 0){
			workswitch= 5.2;
			barbefore=0;
		}
		Lbl2tmp = barbefore + REF(zslinelowbar, barbefore);
		//IF(barbefore > 0) {
		IF(1){
			//workswitch= 5.3;
			IF(Lbh2 - Lbl2tmp > MINiline) {
				Lbl2= Lbl2tmp;
				workswitch= 5.9;

				// 4. 计算中枢区间，以及对比CLOSE
				szhead= MIN(REF(HIGH, Lbh1), REF(HIGH, Lbh2));
				szfoot= MAX(REF(LOW, Lbl1), REF(LOW, Lbl2));
				IF(CLOSE>szhead ){
					workswitch= 9.9;
					goodswitch= 256;
				}
				
			} ELSE {
				workswitch= 5.4;
			}

		} ELSE {
			//workswitch= 5.2;
		}

	} ELSE {
		workswitch= 5.0;
	}

} ELSE{
	workswitch= 2.0;
}

G: goodswitch;

// debug
DW: workswitch;
DL: Lbars;
Dh1: Lbh1;
Dl1: Lbl1;
Dh2: Lbh2;
Dl2: Lbl2;
DH: szhead;
DF: szfoot;

/*
// 中枢成立，跳出中枢成立
IF(ISNULL(isfalse) OR isfalse == 0) {
	// 价格涨太高不考虑
	//IF(CLOSE / zslinelowvalue < 1.3) {
	IF(1){
		is3buy: 1000;
		DRAWICON(1, 300, 1);
	} ELSE is3buy: 0.01;
} ELSE is3buy: 0.01;
*/

/*
		// 第一段 找出高点 h1
		tmp = 2;
		后一个节点= Lbars - tmp * Linejump;
		前一个节点= Lbars - (tmp - 1) * Linejump;
		WHILE(REF(HHV(HIGH, Linejump), 后一个节点) > REF(HHV(HIGH, Linejump), 前一个节点)) {
			tmp = tmp + 1;
			//后一个节点= Lbars - tmp * Linejump;
			//前一个节点= Lbars - (tmp - 1) * Linejump;
			后一个节点= 后一个节点 - Linejump;
			前一个节点= 前一个节点 - Linejump;

		}
		// 	循环失效证明前一个节点是对的
		Lbh1: 前一个节点 + REF(HHVBARS(HIGH, Linejump), 前一个节点 );
		


// 第一段 找出高点 h1
tmp = 2;
Hyg = Lbars - tmp * Linejump;
qyg = Lbars - (tmp - 1) * Linejump;
WHILE(REF(HHV(HIGH, Linejump), Hyg) > REF(HHV(HIGH, Linejump), qyg)) {
	tmp = tmp + 1;
	//后一个节点= Lbars - tmp * Linejump;
	//前一个节点= Lbars - (tmp - 1) * Linejump;
	Hyg = Hyg - Linejump;
	qyg = qyg - Linejump;

}
// 	循环失效证明前一个节点是对的
Lbh1: 100 + REF(abc, 100);



// 第二段 找出低点 l1
tmp = 2;后一个节点 = Lbh1 - tmp * Linejump;前一个节点 = Lbh1 - (tmp - 1) * Linejump;
WHILE(REF(LLV(LOW, Linejump), Lbh1 - tmp * Linejump) < REF(LLV(LOW, Linejump), Lbh1 - (tmp - 1) * Linejump)) {
	tmp = tmp + 1;后一个节点 = Lbh1 - tmp * Linejump;前一个节点 = Lbh1 - (tmp - 1) * Linejump;
}
Lbl1: 前一个节点 + REF(LLVBARS(LOW, Linejump), 前一个节点);
//tmp2: tmp;
// 第三段 找出高点 h2
tmp = 2;后一个节点 = Lbl1 - tmp * Linejump;前一个节点 = Lbl1 - (tmp - 1) * Linejump;
WHILE(REF(HHV(HIGH, Linejump), 后一个节点) > REF(HHV(HIGH, Linejump), 前一个节点)) {
	tmp = tmp + 1;后一个节点 = Lbl1 - tmp * Linejump;前一个节点 = Lbl1 - (tmp - 1) * Linejump;

}
Lbh2: 前一个节点 + REF(HHVBARS(HIGH, Linejump), 前一个节点);
//tmp3: tmp;
// 第四段 找出低点 l2
tmp = 2;后一个节点 = Lbh2 - tmp * Linejump;前一个节点 = Lbh2 - (tmp - 1) * Linejump;
WHILE(REF(LLV(LOW, Linejump), Lbh1 - tmp * Linejump) < REF(LLV(LOW, Linejump), Lbh1 - (tmp - 1) * Linejump)) {
	tmp = tmp + 1;后一个节点 = Lbh2 - tmp * Linejump;前一个节点 = Lbh2 - (tmp - 1) * Linejump;
}
Lbl2: 前一个节点 + REF(LLVBARS(LOW, Linejump), 前一个节点);
//tmp4: tmp;
IF(Lbh1 == 0 OR Lbl1 == 0 OR Lbh2 == 0 OR Lbl2 == 0) {
	isfocus = 0;
} ELSE {
	isfocus = 1;
}


*/

/*
tmp1: tmp;
tt1: 前一个节点;
tt2: REF(HHVBARS(HIGH, Linejump), 前一个节点 );
Lj: Linejump;

IF(ISNULL(Lbars) ){
	DRAWICON(1, 100, 17);
}
*/



// 辅助
bcount = BARSCOUNT(1);
isten = MOD(bcount, 10);
DRAWTEXT(isten == 0, 0, MOD(bcount, 1000)),
coloryellow;
DRAWTEXT(MOD(isten, 5) == 0 AND MOD(isten, 10) != 0, 0, isten),
coloryellow;