import math
PER_CALL={"A":0.000148,"B":0.81/3400}; OR=0.055
prof={"light":(1,2,0.50),"medium":(3,4,0.35),"heavy":(6,8,0.15)}
def calls(a,h): return min(a*h*22*6*0.54,10000)
avg={k:sum(calls(a,h)*pc*(1+OR)*s for a,h,s in prof.values()) for k,pc in PER_CALL.items()}
cap={k:10000*pc*(1+OR) for k,pc in PER_CALL.items()}
pay={"LemonSqueezy (intl sub)":(0.08,0.50),"Paddle":(0.05,0.50)}
DOM=14.2/12; WK=5.0; SIGN=309/12; SENTRY=0; EMAIL=0
def fixed(nfree,npro,signed):
    reqs=nfree*30+npro*(30+1000)  # update checks + licence/quota/model calls (avg)
    wk=0 if reqs<100000*30*0.8 and npro==0 else WK
    return DOM+wk+(SIGN if signed else 0)
print("avg model cost/user:",{k:round(v,3) for k,v in avg.items()},"cap:",{k:round(v,2) for k,v in cap.items()})
for pname,(pp,pf) in pay.items():
  for k in PER_CALL:
    for price in (15,20):
      c=price-(price*pp+pf)-avg[k]
      print(f"{pname:24s} {k} ${price}: net/user ${c:.2f}")
print()
def month(N,conv,opt="A",pname="LemonSqueezy (intl sub)",signed=False):
    pp,pf=pay[pname]; npro=round(N*conv); founders=min(npro,200); reg=npro-founders
    rev=founders*15+reg*20
    fees=sum(p*pp+pf for p,n in ((15,founders),(20,reg)) for _ in range(n))
    model=npro*avg[opt]
    fx=fixed(N-npro,npro,signed)
    return npro,rev,fees,model,fx,rev-fees-model-fx
print("N_users conv | payers | revenue | pay fees | model | fixed | PROFIT  (opt A, LemonSqueezy, unsigned / signed)")
for N in (500,2000,5000,10000,30000):
  for conv in (0,0.01,0.02,0.03):
    a=month(N,conv); b=month(N,conv,signed=True); bb=month(N,conv,opt="B")
    print(f"{N:6d} {conv:4.0%} | {a[0]:4d} | ${a[1]:7.0f} | ${a[2]:6.0f} | ${a[3]:5.0f} | ${a[4]:5.1f} | ${a[5]:7.0f}  signed ${b[5]:7.0f}  optB ${bb[5]:7.0f}")
# payers needed for $2k profit
for opt in PER_CALL:
  for signed in (False,True):
    n=1
    while True:
      pp,pf=pay["LemonSqueezy (intl sub)"]; f=min(n,200); r=n-f
      prof_=f*15+r*20-sum(p*pp+pf for p,m in ((15,f),(20,r)) for _ in range(m))-n*avg[opt]-fixed(0,n,signed)
      if prof_>=2000: break
      n+=1
    print(f"$2k/month profit: option {opt}, {'signed' if signed else 'unsigned'}: {n} payers")
# all-free stress: free users only
for N in (1000,10000,100000,300000):
  reqs=N*30
  print(f"all free {N}: {reqs/1e6:.1f}M req/month -> {'free plan' if reqs<=3e6*0.8 else 'Workers Paid $5'}; monthly cost ${DOM+(0 if reqs<=2.4e6 else WK):.2f}")
