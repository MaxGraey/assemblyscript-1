0;
1;
2;
3;
4;
5;
6;
7;
8;
9;
2147483647;
0x0;
0x1;
0x2;
0x3;
0x4;
0x5;
0x6;
0x7;
0x8;
0x9;
0xA;
0xB;
0xC;
0xD;
0xE;
0xF;
0x7FFFFFFF;
0xa;
0xb;
0xc;
0xd;
0xe;
0xf;
0x7fffffff;
0o0;
0o1;
0o2;
0o3;
0o4;
0o5;
0o6;
0o7;
0o17777777777;
0b0;
0b1;
0b1111111111111111111111111111111;
0.0;
0.123;
.0;
.123;
12.34;
1e1;
1.0e1;
1e+1;
1.0e+1;
1e-1;
1.0e-1;
"123";
"1\"23";
"1\"2\\3";
"\0\n\\n\r";

// invalid
1..;
3u8;
4b;
5-;
6=;
7_;
1.a;
2.0b;
`123`;

// technically invalid, but not handled by AS yet, TS1005: ';' expected
3 4;
5 c;
6.7 d;
a b;
