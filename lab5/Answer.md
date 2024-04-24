# Answer

Name: 林謙宥
ID: 511558008

## Test Valgrind and ASan
### Result
|                      | Valgrind | Asan |
| -------------------- | -------- | ---- |
| Heap out-of-bounds   |     Yes   |   Yes  |
| Stack out-of-bounds  |     No    |   Yes  |
| Global out-of-bounds |     No    |   Yes  |
| Use-after-free       |     Yes   |   Yes  |
| Use-after-return     |     No    |   Yes  |

### Heap out-of-bounds
#### Source code
```
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int *)malloc(5 * sizeof(int)); // Allocating memory for 5 integers
    if (ptr == NULL) {
        printf("Memory allocation failed. Exiting...\n");
        return 1;
    }

    // Writing to memory beyond allocated space
    for (int i = 0; i < 10; i++) {
        ptr[i] = i; // Writing to memory beyond the allocated 5 integers
    }

    // Reading from memory beyond allocated space
    for (int i = 0; i < 10; i++) {
        printf("Value at index %d: %d\n", i, ptr[i]); // Reading from memory beyond the allocated 5 integers
    }

    free(ptr); // Freeing allocated memory

    return 0;
}
```
#### Valgrind Report
```
==10012== Memcheck, a memory error detector
==10012== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==10012== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==10012== Command: ./heap-out-of-bound
==10012== 
==10012== error calling PR_SET_PTRACER, vgdb might block
==10012== Invalid write of size 4
==10012==    at 0x1091FD: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/heap-out-of-bound)
==10012==  Address 0x4a48054 is 0 bytes after a block of size 20 alloc'd
==10012==    at 0x483B7F3: malloc (in /usr/lib/x86_64-linux-gnu/valgrind/vgpreload_memcheck-amd64-linux.so)
==10012==    by 0x1091BE: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/heap-out-of-bound)
==10012== 
Value at index 0: 0
Value at index 1: 1
Value at index 2: 2
Value at index 3: 3
Value at index 4: 4
==10012== Invalid read of size 4
==10012==    at 0x109226: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/heap-out-of-bound)
==10012==  Address 0x4a48054 is 0 bytes after a block of size 20 alloc'd
==10012==    at 0x483B7F3: malloc (in /usr/lib/x86_64-linux-gnu/valgrind/vgpreload_memcheck-amd64-linux.so)
==10012==    by 0x1091BE: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/heap-out-of-bound)
==10012== 
Value at index 5: 5
Value at index 6: 6
Value at index 7: 7
Value at index 8: 8
Value at index 9: 9
==10012== 
==10012== HEAP SUMMARY:
==10012==     in use at exit: 0 bytes in 0 blocks
==10012==   total heap usage: 2 allocs, 2 frees, 1,044 bytes allocated
==10012== 
==10012== All heap blocks were freed -- no leaks are possible
==10012== 
==10012== For lists of detected and suppressed errors, rerun with: -s
==10012== ERROR SUMMARY: 10 errors from 2 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==11722==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x603000000024 at pc 0x7f092a2a82dd bp 0x7fffd27dc180 sp 0x7fffd27dc170
WRITE of size 4 at 0x603000000024 thread T0
    #0 0x7f092a2a82dc in main heap-out-of-bound.c:13
    #1 0x7f0929664082 in __libc_start_main ../csu/libc-start.c:308
    #2 0x7f092a2a81ad in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/heap-out-of-bound-asan+0x11ad)

0x603000000024 is located 0 bytes to the right of 20-byte region [0x603000000010,0x603000000024)
allocated by thread T0 here:
    #0 0x7f0929943808 in __interceptor_malloc ../../../../src/libsanitizer/asan/asan_malloc_linux.cc:144
    #1 0x7f092a2a827c in main heap-out-of-bound.c:5

SUMMARY: AddressSanitizer: heap-buffer-overflow heap-out-of-bound.c:13 in main
Shadow bytes around the buggy address:
  0x0c067fff7fb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c067fff7fc0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c067fff7fd0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c067fff7fe0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c067fff7ff0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0c067fff8000: fa fa 00 00[04]fa fa fa fa fa fa fa fa fa fa fa
  0x0c067fff8010: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c067fff8020: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c067fff8030: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c067fff8040: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c067fff8050: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
  Shadow gap:              cc
==11722==ABORTING
```

### Stack out-of-bounds
#### Source code
```
#include <stdio.h>

int main() {
    int array[5] = {1, 2, 3, 4, 5};
    int array_2 = array[6];
    return 0;
}
```
#### Valgrind Report
```
==22736== Memcheck, a memory error detector
==22736== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==22736== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==22736== Command: ./stack-out-of-bound
==22736== 
==22736== error calling PR_SET_PTRACER, vgdb might block
==22736== 
==22736== HEAP SUMMARY:
==22736==     in use at exit: 0 bytes in 0 blocks
==22736==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==22736== 
==22736== All heap blocks were freed -- no leaks are possible
==22736== 
==22736== For lists of detected and suppressed errors, rerun with: -s
==22736== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==12616==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7fffe870db14 at pc 0x7f5dc0479453 bp 0x7fffe870dad0 sp 0x7fffe870dac0
READ of size 4 at 0x7fffe870db14 thread T0
    #0 0x7f5dc0479452 in vulnerable_function stack-out-of-bound.c:5
    #1 0x7f5dc0479497 in main stack-out-of-bound.c:10
    #2 0x7f5dbf834082 in __libc_start_main ../csu/libc-start.c:308
    #3 0x7f5dc047918d in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/stack-out-of-bound-asan+0x118d)

Address 0x7fffe870db14 is located in stack of thread T0 at offset 52 in frame
    #0 0x7f5dc0479258 in vulnerable_function stack-out-of-bound.c:3

  This frame has 1 object(s):
    [32, 52) 'array' (line 4) <== Memory access at offset 52 overflows this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-buffer-overflow stack-out-of-bound.c:5 in vulnerable_function
Shadow bytes around the buggy address:
  0x10007d0d9b10: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b20: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b30: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b40: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b50: 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1 f1
=>0x10007d0d9b60: 00 00[04]f3 f3 f3 f3 f3 00 00 00 00 00 00 00 00
  0x10007d0d9b70: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9b90: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9ba0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007d0d9bb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
  Shadow gap:              cc
==12616==ABORTING
```

### Global out-of-bounds
#### Source code
```
#include <stdio.h>

int array[5] = {1, 2, 3, 4, 5}; // Global array of size 5

void access_array(int index) {
    printf("Value at index %d: %d\n", index, array[index]); // Accessing the global array
}

int main() {
    int index = 5; // Accessing index 5 which is out of bounds
    access_array(index);
    return 0;
}
```
#### Valgrind Report
```
==12945== Memcheck, a memory error detector
==12945== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==12945== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==12945== Command: ./global-out-of-bound
==12945== 
==12945== error calling PR_SET_PTRACER, vgdb might block
Value at index 5: 0
==12945== 
==12945== HEAP SUMMARY:
==12945==     in use at exit: 0 bytes in 0 blocks
==12945==   total heap usage: 1 allocs, 1 frees, 1,024 bytes allocated
==12945== 
==12945== All heap blocks were freed -- no leaks are possible
==12945== 
==12945== For lists of detected and suppressed errors, rerun with: -s
==12945== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==13229==ERROR: AddressSanitizer: global-buffer-overflow on address 0x7f94b8851034 at pc 0x7f94b884e24d bp 0x7ffff4ddc020 sp 0x7ffff4ddc010
READ of size 4 at 0x7f94b8851034 thread T0
    #0 0x7f94b884e24c in access_array global-out-of-bound.c:6
    #1 0x7f94b884e25e in main global-out-of-bound.c:11
    #2 0x7f94b7c04082 in __libc_start_main ../csu/libc-start.c:308
    #3 0x7f94b884e12d in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/global-out-of-bound-asan+0x112d)

0x7f94b8851034 is located 0 bytes to the right of global variable 'array' defined in './global-out-of-bound.c:3:5' (0x7f94b8851020) of size 20
SUMMARY: AddressSanitizer: global-buffer-overflow global-out-of-bound.c:6 in access_array
Shadow bytes around the buggy address:
  0x0ff3171021b0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff3171021c0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff3171021d0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff3171021e0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff3171021f0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0ff317102200: 00 00 00 00 00 00[04]f9 f9 f9 f9 f9 00 00 00 00
  0x0ff317102210: f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9
  0x0ff317102220: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff317102230: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff317102240: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff317102250: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
  Shadow gap:              cc
==13229==ABORTING
```

### Use-after-free
#### Source code
```
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Allocating memory
    int *ptr = (int *)malloc(sizeof(int));
    if (ptr == NULL) {
        printf("Memory allocation failed. Exiting...\n");
        return 1;
    }

    // Assigning a value to the allocated memory
    *ptr = 42;
    printf("Value before freeing: %d\n", *ptr);

    // Freeing the allocated memory
    free(ptr);
    printf("Memory freed.\n");

    // Attempting to use the freed memory
    printf("Value after freeing: %d\n", *ptr); // Use-after-free vulnerability

    return 0;
}
```
#### Valgrind Report
```
==13472== Memcheck, a memory error detector
==13472== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==13472== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==13472== Command: ./use-after-free
==13472== 
==13472== error calling PR_SET_PTRACER, vgdb might block
Value before freeing: 42
Memory freed.
==13472== Invalid read of size 4
==13472==    at 0x10921C: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/use-after-free)
==13472==  Address 0x4a48040 is 0 bytes inside a block of size 4 free'd
==13472==    at 0x483CA3F: free (in /usr/lib/x86_64-linux-gnu/valgrind/vgpreload_memcheck-amd64-linux.so)
==13472==    by 0x10920B: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/use-after-free)
==13472==  Block was alloc'd at
==13472==    at 0x483B7F3: malloc (in /usr/lib/x86_64-linux-gnu/valgrind/vgpreload_memcheck-amd64-linux.so)
==13472==    by 0x1091BE: main (in /mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/use-after-free)
==13472== 
Value after freeing: 42
==13472== 
==13472== HEAP SUMMARY:
==13472==     in use at exit: 0 bytes in 0 blocks
==13472==   total heap usage: 2 allocs, 2 frees, 1,028 bytes allocated
==13472== 
==13472== All heap blocks were freed -- no leaks are possible
==13472== 
==13472== For lists of detected and suppressed errors, rerun with: -s
==13472== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0
```
### ASan Report
```
==13631==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010 at pc 0x7fe0da5c733a bp 0x7fffc4f71ac0 sp 0x7fffc4f71ab0
READ of size 4 at 0x602000000010 thread T0
    #0 0x7fe0da5c7339 in main use-after-free.c:21
    #1 0x7fe0d9984082 in __libc_start_main ../csu/libc-start.c:308
    #2 0x7fe0da5c71ad in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/use-after-free-asan+0x11ad)

0x602000000010 is located 0 bytes inside of 4-byte region [0x602000000010,0x602000000014)
freed by thread T0 here:
    #0 0x7fe0d9c6340f in __interceptor_free ../../../../src/libsanitizer/asan/asan_malloc_linux.cc:122
    #1 0x7fe0da5c72cc in main use-after-free.c:17

previously allocated by thread T0 here:
    #0 0x7fe0d9c63808 in __interceptor_malloc ../../../../src/libsanitizer/asan/asan_malloc_linux.cc:144
    #1 0x7fe0da5c7277 in main use-after-free.c:6

SUMMARY: AddressSanitizer: heap-use-after-free use-after-free.c:21 in main
Shadow bytes around the buggy address:
  0x0c047fff7fb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c047fff7fc0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c047fff7fd0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c047fff7fe0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c047fff7ff0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0c047fff8000: fa fa[fd]fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8010: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8020: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8030: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8040: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8050: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
  Shadow gap:              cc
==13631==ABORTING
```

### Use-after-return
#### Source code
```
#include <stdio.h>

int *get_pointer() {
    int value = 42;
    return &value; // Returning a pointer to a local variable
}

int main() {
    int *ptr = get_pointer();
    printf("Value: %d\n", *ptr); // Using the returned pointer

    *ptr = 42;
    // Accessing the pointer after its lifetime has ended
    printf("Value after return: %d\n", *ptr); // Use-after-return vulnerability

    return 0;
}
```
#### Valgrind Report
```
==23727== Memcheck, a memory error detector
==23727== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==23727== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==23727== Command: ./use-after-return
==23727== 
==23727== error calling PR_SET_PTRACER, vgdb might block
==23727==ASan runtime does not come first in initial library list; you should either link runtime to your application or manually preload it with LD_PRELOAD.
==23727== 
==23727== HEAP SUMMARY:
==23727==     in use at exit: 0 bytes in 0 blocks
==23727==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==23727== 
==23727== All heap blocks were freed -- no leaks are possible
==23727== 
==23727== For lists of detected and suppressed errors, rerun with: -s
==23727== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
AddressSanitizer:DEADLYSIGNAL
=================================================================
==14298==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000 (pc 0x7f5adbdcb221 bp 0x000000000000 sp 0x7fffd66958a0 T0)
==14298==The signal is caused by a READ memory access.
==14298==Hint: address points to the zero page.
    #0 0x7f5adbdcb220 in main use-after-return.c:10
    #1 0x7f5adb174082 in __libc_start_main ../csu/libc-start.c:308
    #2 0x7f5adbdcb12d in _start (/mnt/c/Users/joshua/OneDrive/文件/在職專班/軟體測試與程式安全/112-spring-software-testing-and-secure-programming/lab5/use-after-return-asan+0x112d)

AddressSanitizer can not provide additional info.
SUMMARY: AddressSanitizer: SEGV use-after-return.c:10 in main
==14298==ABORTING
```

## ASan Out-of-bound Write bypass Redzone
### Source code
```
#include <stdio.h>

void main(int argc, char **argv) {
    int a[8] = { 0,1,2,3,4,5,6,7 };
    int b[8] = { 8,9,10,11,12,13,14,15 };
    printf("a[0]: %d\n", a[0]);
    a[16] = 9;
    printf("a[16]: %d\n", a[16]);
    return;
}
```
### Why
否，因為ASan僅檢查Shadow，不向後檢查。
