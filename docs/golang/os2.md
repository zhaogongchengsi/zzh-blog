---
sidebar_position: 5
---


# 标准库学习 - os (系统和进程)

## PricAttr 进程
- ProcAttr 保管将被StartProcess函数用于一个新进程的属性
- Process 保管一个被StarProcess创建的进程的信息。
- ProcessState保管Wait函数报告的某个已退出进程的信息。
```go
type ProcAttr struct {
    // 如果Dir非空，子进程会在创建进程前先进入该目录。（即设为当前工作目录）
    Dir string
    // 如果Env非空，它会作为新进程的环境变量。必须采用Environ返回值的格式。
    // 如果Env为空字符串，将使用Environ函数的返回值。
    Env []string
    // Files指定被新进程继承的活动文件对象。
    // 前三个绑定为标准输入、标准输出、标准错误输出。
    // 依赖底层操作系统的实现可能会支持额外的数据出入途径。
    // nil条目相当于在进程开始时关闭的文件对象。
    Files []*File
    // 操作系统特定的创建属性。
    // 注意设置本字段意味着你的程序可能会运作失常甚至在某些操作系统中无法通过编译。
    Sys *syscall.SysProcAttr
}

type Process struct {
    Pid int
    // 内含隐藏或非导出字段
}

type ProcessState struct {
    // 内含隐藏或非导出字段
}
```

### 查找进程
1. ***FindProcess*** FindProcess根据进程id查找一个运行中的进程。函数返回的进程对象可以用于获取其关于底层操作系统进程的信息。

```go
func FindProcess(pid int) (p *Process, err error)
```

### 开始进程
2. ***StartProcess*** StartProcess使用提供的属性、程序名、命令行参数开始一个新进程。StartProcess函数是一个低水平的接口。os/exec包提供了高水平的接口，应该尽量使用该包。如果出错，错误的底层类型会是*PathError。

```go
func StartProcess(name string, argv []string, attr *ProcAttr) (*Process, error)
```

3. ***Signal*** Signal方法向进程发送一个信号。在windows中向进程发送Interrupt信号尚未实现。

```go
func (p *Process) Signal(sig Signal) error
```

### 杀死进程
4. ***Kill*** Kill让进程立刻退出

```go
func (p *Process) Kill() error
```

5. ***Wait*** Wait方法阻塞直到进程退出，然后返回一个描述ProcessState描述进程的状态和可能的错误。Wait方法会释放绑定到进程p的所有资源。在大多数操作系统中，进程p必须是当前进程的子进程，否则会返回错误。

```go
func (p *Process) Wait() (*ProcessState, error)
```

### 释放进程资源
6. ***Release*** Release释放进程p绑定的所有资源， 使它们（资源）不能再被（进程p）使用。只有没有调用Wait方法时才需要调用本方法。

```go
func (p *Process) Release() error
```

### 进程退出报告
7. ***Pid*** Pi返回一个已退出的进程的进程id。

```go
func (p *ProcessState) Pid() int
```

8. ***Exited*** Exited报告进程是否已退出。

```go
func (p *ProcessState) Exited() bool
```

9. ***Success*** Success报告进程是否成功退出，如在Unix里以状态码0退出

```go
func (p *ProcessState) Success() bool
```

10. ***SystemTime*** SystemTime返回已退出进程及其子进程耗费的系统CPU时间。

```go
func (p *ProcessState) SystemTime() time.Duration
```

11. ***UserTime*** UserTime返回已退出进程及其子进程耗费的用户CPU时间。

```go
func (p *ProcessState) UserTime() time.Duration
```

12. ***Sys*** Sys返回该已退出进程系统特定的退出信息。需要将其类型转换为适当的底层类型，如Unix里转换为*syscall.WaitStatus类型以获取其内容。

```go
func (p *ProcessState) Sys() interface{}
```

13. ***SysUsage*** SysUsage返回该已退出进程系统特定的资源使用信息。需要将其类型转换为适当的底层类型，如Unix里转换为*syscall.Rusage类型以获取其内容。

```go
func (p *ProcessState) SysUsage() interface{}
```

14. ***String*** 

```go
func (p *ProcessState) String() string
```

## 系统信息