// 1.取10个单位前80个单位数据比较最高价与当前价 next / 0
// 2.找前期最低点（以80个单位为测量间隔）
// 3.区间中枢判断

/*
pull=10;             // #参数
pierod=80;         // #参数
jump=80;            // #参数
tpart=6;            // #参数
*/
// 1
abc = HHVBARS(HIGH, 12);

IF(CLOSE > REF(HHV(HIGH, pierod), pull)) {
	//IF(CLOSE > REF(HHV(HIGH, 80), 5)) {
	// 2
	/* 错了
    WHILE(REF(LLV(LOW, pierod), pull + jump - pierod) > REF(LLV(LOW, pierod), pull + jump) ) {
        jump = jump + pierod;
    }
    Lbars = LLVBARS(LOW, jump + pull); 
    */

	pierodtmp = pierod;
	//WHILE(REF(LLV(LOW, jump), pull + pierod - jump) > REF(LLV(LOW, jump), pull + pierod)) {
	WHILE(LLV(LOW, pull + pierodtmp - jump) > LLV(LOW, pull + pierodtmp)) {
		pierodtmp = pierodtmp + jump;
	}
	Lbars: LLVBARS(LOW, pierodtmp + pull);

	最低中枢单位 = 28;最大中枢单位 = 240;
	//IF(Lbars>最低中枢单位 AND Lbars<最大中枢单位 ) {
	//IF(1){
	// 3
	// 按8段分探测线段长度
	//Linejump := CONST(CEIL(Lbars / tpart));
	Linejump = TPART;
	//tptmp = Lbars / tpart;
	//Linejump = tptmp-MOD(tptmp*10, 10);
	// 开始测试线段
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
		
*/

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

	/*
		tmp1: tmp;
		tt1: 前一个节点;
		tt2: REF(HHVBARS(HIGH, Linejump), 前一个节点 );
		Lj: Linejump;
		*/

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

	// 辅助
	bcount = BARSCOUNT(1);
	isten = MOD(bcount, 10) == 0;
	DRAWTEXT(isten, CLOSE, bcount),
	coloryellow;

	//}
}
//ELSE isfocus = 0;

/*
LoT1:=  REF(LLV(LOW,T1),N);
LoT2:= REF(LLV(LOW,T2),N);
HiT1:= REF(HHV(HIGH,T1),N);
HiT2:= REF(HHV(HIGH,T2),N);
三买指针: CLOSE;
中枢l: MAX(LoT1, LoT2);
中枢h: MIN(HiT1, HiT2);
/* 测试段
a: REF(LLV(LOW,100),20);
b: LLV(LOW,100);
*/
