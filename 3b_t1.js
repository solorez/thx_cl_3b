
// 1.取10个单位前80个单位数据比较最高价与当前价 next / 0
// 2.找前期最低点（以80个单位为测量间隔）
// 3.区间中枢判断
// A: CLOSE;
// B: HHV(HIGH,80);
/*
pull=10;             // #参数
pierod=80;         // #参数
jump=80;            // #参数
tpart=6;            // #参数
*/
// 1



//IF(CLOSE > REF(HHV(HIGH, pierod), pull) ) 
//{
    // 2
    /* 错了
    WHILE(REF(LLV(LOW, pierod), pull + jump - pierod) > REF(LLV(LOW, pierod), pull + jump) ) {
        jump = jump + pierod;
    }
    Lbars = LLVBARS(LOW, jump + pull);
    */	 
	 
	 WHILE(REF(LLV(LOW, jump), pull + pierod - jump) > REF(LLV(LOW, jump), pull + pierod) ) {
        pierod= pierod + jump;
    }
    Lbars : LLVBARS(LOW, pierod + pull);
    

    // 3
    // 按8段分探测线段长度
    Linejump = INTPART(Lbars / tpart);

    // 开始测试线段

    // 第一段 找出高点 h1
    tmp = 2;
    WHILE(REF(HHV(HIGH, Linejump), Lbars - tmp * Linejump) > REF(HHV(HIGH, Linejump), Lbars - (tmp - 1) * Linejump) ) {
        tmp = tmp + 1;
    }
    // Lbh1t=REF(HHVBARS(HIGH,Linejump),Lbars-(tmp-1)*Linejump);
    // 错的 Lbh1 : Lbars - (tmp - 1) * Linejump + REF(HHVBARS(HIGH, Linejump), Lbars - (tmp - 1) * Linejump);
    Lbh1 : Lbars-(tmp - 1)*Linejump + HHVBARS(REF(HIGH, Lbars-(tmp-1)*Linejump), Linejump);


    // 第二段 找出低点 l1
    tmp = 2;
    WHILE(REF(LLV(LOW, Linejump), Lbh1 - tmp * Linejump) < REF(LLV(LOW, Linejump), Lbh1 - (tmp - 1) * Linejump) ) {
        tmp = tmp + 1;
    }
    Lbl1 : Lbh1-(tmp-1)*Linejump + LLVBARS(REF(LOW, Lbh1-(tmp -1)*Linejump), Linejump);


    // 第三段 找出高点 h2
    tmp = 2;
    WHILE(REF(HHV(HIGH, Linejump), Lbl1 - tmp * Linejump) > REF(HHV(HIGH, Linejump), Lbl1 - (tmp - 1) * Linejump) ) {
        tmp = tmp + 1;
    }
    Lbh2 : Lbl1-(tmp - 1)*Linejump + HHVBARS(REF(HIGH, Lbl1-(tmp-1)*Linejump), Linejump);


    // 第四段 找出低点 l2
    tmp = 2;
    WHILE(REF(LLV(LOW, Linejump), Lbh2 - tmp * Linejump) < REF(LLV(LOW, Linejump), Lbh2 - (tmp - 1) * Linejump) ) {
        tmp = tmp + 1;
    }
    Lbl2 : Lbh2-(tmp-1)*Linejump + LLVBARS(REF(LOW, Lbh2-(tmp -1)*Linejump), Linejump);



	IF(Lbh1==0 OR Lbl1==0 OR Lbh2==0 OR Lbl2==0 ){
		isfocus = 0;
	}
	ELSE{
		isfocus : 1;
	}


//}
//ELSE isfocus = 0;


// 辅助
bcount = BARSCOUNT(1);
isten = MOD(bcount, 10)==0;
DRAWTEXT(isten, CLOSE, bcount), coloryellow;

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