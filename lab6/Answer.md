Name: 
ID: 

### Fuzz Monitor
```
                       american fuzzy lop 2.52b (bmpcomp)

┌─ process timing ─────────────────────────────────────┬─ overall results ─────┐
│        run time : 0 days, 0 hrs, 1 min, 48 sec       │  cycles done : 0      │
│   last new path : 0 days, 0 hrs, 0 min, 53 sec       │  total paths : 9      │
│ last uniq crash : 0 days, 0 hrs, 1 min, 32 sec       │ uniq crashes : 1      │
│  last uniq hang : 0 days, 0 hrs, 1 min, 28 sec       │   uniq hangs : 1      │
├─ cycle progress ────────────────────┬─ map coverage ─┴───────────────────────┤
│  now processing : 0 (0.00%)         │    map density : 0.05% / 0.05%         │
│ paths timed out : 0 (0.00%)         │ count coverage : 1.74 bits/tuple       │
├─ stage progress ────────────────────┼─ findings in depth ────────────────────┤
│  now trying : arith 8/8             │ favored paths : 1 (11.11%)             │
│ stage execs : 776/1763 (44.02%)     │  new edges on : 3 (33.33%)             │
│ total execs : 1639                  │ total crashes : 50 (1 unique)          │
│  exec speed : 18.44/sec (zzzz...)   │  total tmouts : 111 (5 unique)         │
├─ fuzzing strategy yields ───────────┴───────────────┬─ path geometry ────────┤
│   bit flips : 5/224, 3/223, 1/221                   │    levels : 2          │
│  byte flips : 0/28, 0/27, 0/25                      │   pending : 9          │
│ arithmetics : 0/0, 0/0, 0/0                         │  pend fav : 1          │
│  known ints : 0/0, 0/0, 0/0                         │ own finds : 8          │
│  dictionary : 0/0, 0/0, 0/0                         │  imported : n/a        │
│       havoc : 0/0, 0/0                              │ stability : 100.00%    │
│        trim : 100.00%/37, 0.00%                     ├────────────────────────┘
└─────────────────────────────────────────────────────┘          [cpu000:  9%]
```

### Run Crash Result
```
size of Herder 54
AddressSanitizer:DEADLYSIGNAL
=================================================================
==14297==ERROR: AddressSanitizer: stack-overflow on address 0x7ffff65f4498 (pc 0x7f30cc0ac01f bp 0x7ffff6df28f0 sp 0x7ffff65f34a0 T0)
    #0 0x7f30cc0ac01e in main /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab6/src/hw0302.c:46
    #1 0x7f30cb304082 in __libc_start_main ../csu/libc-start.c:308
    #2 0x7f30cc0accad in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab6/src/bmpcomp+0x2cad)

SUMMARY: AddressSanitizer: stack-overflow /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab6/src/hw0302.c:46 in main
==14297==ABORTING
```
