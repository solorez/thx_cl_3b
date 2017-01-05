/*
具备中枢且脱离中枢

用法：
worked=100 > baseline=10 证明具备中枢且现脱离中枢向上
goodboy	根据数值观察走到程序哪一步
*/

/* 参数说明
PULL		距离当前周期单位开始寻找中枢和低位
PIEROD 		初始探测低位周期长度
JUMP 		探测低位周期步进
TPART 		从低位开始探测中枢的周期长度步进 		
*/

// 判断switch
workswitch=0;		// worked
goodswitch=0;		// goodboy
baseline:20;

// 常量
// 没办法用动态步进 只能用tpart直接代替步进
Linejump = TPART;
zslinehighbar = HHVBARS(HIGH, TPART);
zslinehighvalue = HHV(HIGH, TPART);
zslinelowbar = LLVBARS(LOW, TPART);
zslinelowvalue = LLV(LOW, TPART);

// 用HIGH>CLOSE去比较可以过滤一些瞬间值
IF(HIGH> REF(HHV(CLOSE, pierod), pull)) {
//IF(1){
	pierodtmp = PIEROD;
	WHILE(LLV(LOW, pull + pierodtmp - JUMP) > LLV(LOW, pull + pierodtmp)) {
		pierodtmp = pierodtmp + JUMP;
	}
	// 低位位置
	Lbars: LLVBARS(LOW, pierodtmp + pull);

	workswitch=1;
}

// 开始测试线段
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
		IF(Lbars - Lbh1tmp > 4) {
			Lbh1: Lbh1tmp;
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
			IF(Lbh1 - Lbl1tmp > 4) {
				Lbl1: Lbl1tmp;
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
			IF(Lbl1 - Lbh2tmp > 4) {
				Lbh2: Lbh2tmp;
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
		workswitch= 4.1;
		WHILE(REF(zslinelowvalue, barbehind) < REF(zslinelowvalue, barbefore)) {
			barbehind = barbehind - Linejump;
			barbefore = barbefore - Linejump;
		}
		IF(barbefore > 0) {
			Lbl2tmp = barbefore + REF(zslinelowbar, barbefore);
			workswitch= 4.3;
			IF(Lbh2 - Lbl2tmp > 4) {
				Lbl2: Lbl2tmp;
				workswitch= 4.9;
				goodswitch= 100;
			} ELSE {
				workswitch= 4.4;
			}

		} ELSE {
			workswitch= 4.2;
		}

	} ELSE {
		workswitch= 5.0;
	}

} ELSE{
	workswitch= 2.0;
}

worked: workswitch;
goodboy: goodswitch;

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

// 1. 判断当前价格是否一段时间内高位，满足3买前提

// 辅助
bcount = BARSCOUNT(1);
isten = MOD(bcount, 10);
DRAWTEXT(isten == 0, 0, MOD(bcount, 1000)),
coloryellow;
DRAWTEXT(MOD(isten, 5) == 0 AND MOD(isten, 10) != 0, 0, isten),
coloryellow;