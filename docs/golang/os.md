---
sidebar_position: 4
---

# 标准库学习 - os (文件和目录)

os包提供了操作系统函数的不依赖平台的接口。设计为Unix风格的，虽然错误处理是go风格的；失败的调用会返回错误值而非错误码。通常错误值里包含更多信息。例如，如果某个使用一个文件名的调用（如Open、Stat）失败了，打印错误时会包含该文件名，错误类型将为*PathError，其内部可以解包获得更多信息。os包的接口规定为在所有操作系统中都是一致的。非公用的属性可以从操作系统特定的syscall包获取

### Constants
> 用于包装底层系统的参数用于Open函数，不是所有的flag都能在特定系统里使用的。
```go
const (
    O_RDONLY int = syscall.O_RDONLY // 只读模式打开文件
    O_WRONLY int = syscall.O_WRONLY // 只写模式打开文件
    O_RDWR   int = syscall.O_RDWR   // 读写模式打开文件
    O_APPEND int = syscall.O_APPEND // 写操作时将数据附加到文件尾部
    O_CREATE int = syscall.O_CREAT  // 如果不存在将创建一个新文件
    O_EXCL   int = syscall.O_EXCL   // 和O_CREATE配合使用，文件必须不存在
    O_SYNC   int = syscall.O_SYNC   // 打开文件用于同步I/O
    O_TRUNC  int = syscall.O_TRUNC  // 如果可能，打开时清空文件
)
```

> 指定Seek函数从何处开始搜索（即相对位置）
```go
const (
    SEEK_SET int = 0 // 相对于文件起始位置seek
    SEEK_CUR int = 1 // 相对于文件当前位置seek
    SEEK_END int = 2 // 相对于文件结尾位置seek
)
```

> DevNull是操作系统空设备的名字。在类似Unix的操作系统中，是"/dev/null"；在Windows中，为"NUL"。
```go
const (
    PathSeparator     = '/' // 操作系统指定的路径分隔符
    PathListSeparator = ':' // 操作系统指定的表分隔符
)
const DevNull = "/dev/null"
```

### Variables

> 一些可移植的、共有的系统调用错误。
```go
var (
    ErrInvalid    = errors.New("invalid argument")
    ErrPermission = errors.New("permission denied")
    ErrExist      = errors.New("file already exists")
    ErrNotExist   = errors.New("file does not exist")
)
```

> Stdin、Stdout和Stderr是指向标准输入、标准输出、标准错误输出的文件描述符。
```go
var (
    Stdin  = NewFile(uintptr(syscall.Stdin), "/dev/stdin")
    Stdout = NewFile(uintptr(syscall.Stdout), "/dev/stdout")
    Stderr = NewFile(uintptr(syscall.Stderr), "/dev/stderr")
)
```

> Args保管了命令行参数，第一个是程序名。
```go
var Args []string
```

## File 文件对象
File 代表一个***打开***的文件对象
```go
type File struct {
    // 内含隐藏或非导出字段
}
```
### 创建文件
1. ***Create*** Create采用模式0666（任何人都可读写，不可执行）创建一个名为name的文件，如果文件已存在会截断它（为空文件）。如果成功，返回的文件对象可用于I/O；对应的文件描述符具有O_RDWR模式。如果出错，错误底层类型是*PathError

```go
func Create(name string) (file *File, err error)
```

### 打开文件
2. ***OpenFile*** OpenFile是一个更一般性的文件打开函数，大多数调用者都应用Open或Create代替本函数。它会使用指定的选项（如O_RDONLY等）、指定的模式（如0666等）打开指定名称的文件。如果操作成功，返回的文件对象可用于I/O。如果出错，错误底层类型是*PathError。

```go
func OpenFile(name string, flag int, perm FileMode) (file *File, err error)
```

3. ***NewFile*** NewFile使用给出的Unix文件描述符和名称创建一个文件

```go
func NewFile(fd uintptr, name string) *File
```

4. ***Pipe*** Pipe返回一对关联的文件对象。从r的读取将返回写入w的数据。本函数会返回两个文件对象和可能的错误。

```go
func Pipe() (r *File, w *File, err error)
```
### 获取文件信息
5. ***Name*** Name方法返回（提供给Open/Create等方法的）文件名称

```go
func (f *File) Name() string
```

6. ***Stat*** Stat返回描述文件f的FileInfo类型值。如果出错，错误底层类型是*PathError

```go
func (f *File) Stat() (fi FileInfo, err error)
```

7. ***Fd*** Fd返回与文件f对应的整数类型的Unix文件描述符

```go
func (f *File) Fd() uintptr
```

### 修改文件模式

8. ***Chdir*** Chdir将当前工作目录修改为f，f必须是一个目录。如果出错，错误底层类型是*PathError

```go
func (f *File) Chdir() error
```

9. ***Chown*** Chown修改文件的用户ID和组ID。如果出错，错误底层类型是*PathError。

```go
func (f *File) Chown(uid, gid int) error
```

### 获取目录信息

10. ***Readdir*** Readdir读取目录f的内容，返回一个有n个成员的[]FileInfo，这些FileInfo是被Lstat返回的，采用目录顺序。对本函数的下一次调用会返回上一次调用剩余未读取的内容的信息。

如果n>0，Readdir函数会返回一个最多n个成员的切片。这时，如果Readdir返回一个空切片，它会返回一个非nil的错误说明原因。如果到达了目录f的结尾，返回值err会是io.EOF。

如果n<=0，Readdir函数返回目录中剩余所有文件对象的FileInfo构成的切片。此时，如果Readdir调用成功（读取所有内容直到结尾），它会返回该切片和nil的错误值。如果在到达结尾前遇到错误，会返回之前成功读取的FileInfo构成的切片和该错误

```go
func (f *File) Readdir(n int) (fi []FileInfo, err error)
```

11. ***Readdirnames*** Readdir读取目录f的内容，返回一个有n个成员的[]string，切片成员为目录中文件对象的名字，采用目录顺序。对本函数的下一次调用会返回上一次调用剩余未读取的内容的信息。

如果n>0，Readdir函数会返回一个最多n个成员的切片。这时，如果Readdir返回一个空切片，它会返回一个非nil的错误说明原因。如果到达了目录f的结尾，返回值err会是io.EOF。

如果n<=0，Readdir函数返回目录中剩余所有文件对象的名字构成的切片。此时，如果Readdir调用成功（读取所有内容直到结尾），它会返回该切片和nil的错误值。如果在到达结尾前遇到错误，会返回之前成功读取的名字构成的切片和该错误

```go
func (f *File) Readdirnames(n int) (names []string, err error)
```

### 操作文件（写入 修改）

12. ***Truncate*** Truncate改变文件的大小，它不会改变I/O的当前位置。 如果截断文件，多出的部分就会被丢弃。如果出错，错误底层类型是*PathError

```go
func (f *File) Truncate(size int64) error
```

13. ***Read*** Read方法从f中读取最多len(b)字节数据并写入b。它返回读取的字节数和可能遇到的任何错误。文件终止标志是读取0个字节且返回值err为io.EOF

```go
func (f *File) Read(b []byte) (n int, err error)
```

14. ***ReadAt*** ReadAt从指定的位置（相对于文件开始位置）读取len(b)字节数据并写入b。它返回读取的字节数和可能遇到的任何错误。当n < len(b)时，本方法总是会返回错误；如果是因为到达文件结尾，返回值err会是io.EOF。

```go
func (f *File) ReadAt(b []byte, off int64) (n int, err error)
```

15. ***Write*** Write向文件中写入len(b)字节数据。它返回写入的字节数和可能遇到的任何错误。如果返回值n!=len(b)，本方法会返回一个非nil的错误。

```go
func (f *File) Write(b []byte) (n int, err error)
```

16. ***WriteString*** WriteString类似Write，但接受一个字符串参数。

```go
func (f *File) WriteString(s string) (ret int, err error)
```

17. ***WriteAt*** WriteAt在指定的位置（相对于文件开始位置）写入len(b)字节数据。它返回写入的字节数和可能遇到的任何错误。如果返回值n!=len(b)，本方法会返回一个非nil的错误

```go
func (f *File) WriteAt(b []byte, off int64) (n int, err error)
```

18. ***Seek*** Seek设置下一次读/写的位置。offset为相对偏移量，而whence决定相对位置：0为相对文件开头，1为相对当前位置，2为相对文件结尾。它返回新的偏移量（相对开头）和可能的错误

```go
func (f *File) Seek(offset int64, whence int) (ret int64, err error)
```

19. ***Sync*** Sync递交文件的当前内容进行稳定的存储。一般来说，这表示将文件系统的最近写入的数据在内存中的拷贝刷新到硬盘中稳定保存

```go
func (f *File) Sync() (err error)
```

### 关闭文件
20. ***Close*** Close关闭文件f，使文件不能用于读写。它返回可能出现的错误
```go
func (f *File) Close() error
```

## 文件模式和权限

FileMode代表文件的模式和权限位。这些字位在所有的操作系统都有相同的含义，因此文件的信息可以在不同的操作系统之间安全的移植。不是所有的位都能用于所有的系统，唯一共有的是用于表示目录的ModeDir位。


```go
const (
    // 单字符是被String方法用于格式化的属性缩写。
    ModeDir        FileMode = 1 << (32 - 1 - iota) // d: 目录
    ModeAppend                                     // a: 只能写入，且只能写入到末尾
    ModeExclusive                                  // l: 用于执行
    ModeTemporary                                  // T: 临时文件（非备份文件）
    ModeSymlink                                    // L: 符号链接（不是快捷方式文件）
    ModeDevice                                     // D: 设备
    ModeNamedPipe                                  // p: 命名管道（FIFO）
    ModeSocket                                     // S: Unix域socket
    ModeSetuid                                     // u: 表示文件具有其创建者用户id权限
    ModeSetgid                                     // g: 表示文件具有其创建者组id的权限
    ModeCharDevice                                 // c: 字符设备，需已设置ModeDevice
    ModeSticky                                     // t: 只有root/创建者能删除/移动文件
    // 覆盖所有类型位（用于通过&获取类型位），对普通文件，所有这些位都不应被设置
    ModeType = ModeDir | ModeSymlink | ModeNamedPipe | ModeSocket | ModeDevice
    ModePerm FileMode = 0777 // 覆盖所有Unix权限位（用于通过&获取类型位）
)
```
这些被定义的位是FileMode最重要的位。另外9个不重要的位为标准Unix rwxrwxrwx权限（任何人都可读、写、运行）。这些（重要）位的值应被视为公共API的一部分，可能会用于线路协议或硬盘标识：它们不能被修改，但可以添加新的位

1. ***IsDir*** IsDir报告m是否是一个目录。

```go
func (m FileMode) IsDir() bool
```

2. ***IsRegular*** IsRegular报告m是否是一个普通文件。

```go
func (m FileMode) IsRegular() bool
```

3. ***Perm*** Perm方法返回m的Unix权限位。

```go
func (m FileMode) Perm() FileMode
```

4. ***String*** 

```go
func (m FileMode) String() string
```

### 文件信息

```go
type FileInfo interface {
    Name() string       // 文件的名字（不含扩展名）
    Size() int64        // 普通文件返回值表示其大小；其他文件的返回值含义各系统不同
    Mode() FileMode     // 文件的模式位
    ModTime() time.Time // 文件的修改时间
    IsDir() bool        // 等价于Mode().IsDir()
    Sys() interface{}   // 底层数据来源（可以返回nil）
}
```

1. ***Stat*** Stat返回一个描述name指定的文件对象的FileInfo。如果指定的文件对象是一个符号链接，返回的FileInfo描述该符号链接指向的文件的信息，本函数会尝试跳转该链接。如果出错，返回的错误值为*PathError类型

```go
func Stat(name string) (fi FileInfo, err error)
```

2. ***Lstat*** Lstat返回一个描述name指定的文件对象的FileInfo。如果指定的文件对象是一个符号链接，返回的FileInfo描述该符号链接的信息，本函数不会试图跳转该链接。如果出错，返回的错误值为*PathError类型

```go
func Lstat(name string) (fi FileInfo, err error)
```

3. ***IsPathSeparator*** IsPathSeparator返回字符c是否是一个路径分隔符。

```go
func IsPathSeparator(c uint8) bool
```

4. ***IsExist*** 返回一个布尔值说明该错误是否表示一个文件或目录已经存在。ErrExist和一些系统调用错误会使它返回真。

```go
func IsExist(err error) bool
```

5. ***IsNotExist*** 返回一个布尔值说明该错误是否表示一个文件或目录不存在。ErrNotExist和一些系统调用错误会使它返回真。

```go
func IsNotExist(err error) bool
```

6. ***IsPermission*** 返回一个布尔值说明该错误是否表示因权限不足要求被拒绝。ErrPermission和一些系统调用错误会使它返回真。

```go
func IsPermission(err error) bool
```

7. ***Getwd*** Getwd返回一个对应当前工作目录的根路径。如果当前目录可以经过多条路径抵达（因为硬链接），Getwd会返回其中一个。

```go
func Getwd() (dir string, err error)
```

8. ***Chmod*** Chmod修改name指定的文件对象的mode。如果name指定的文件是一个符号链接，它会修改该链接的目的地文件的mode。如果出错，会返回*PathError底层类型的错误。

```go
func Chmod(name string, mode FileMode) error
```
9. ***Chown*** Chmod修改name指定的文件对象的用户id和组id。如果name指定的文件是一个符号链接，它会修改该符号链接自身的用户id和组id。如果出错，会返回*PathError底层类型的错误

```go
func Lchown(name string, uid, gid int) error
```

10. ***Chtimes*** Chtimes修改name指定的文件对象的访问时间和修改时间，类似Unix的utime()或utimes()函数。底层的文件系统可能会截断/舍入时间单位到更低的精确度。如果出错，会返回*PathError底层类型的错误。

```go
func Chtimes(name string, atime time.Time, mtime time.Time) error
```

## 目录操作

### 创建目录

1. ***Mkdir*** Mkdir使用指定的权限和名称创建一个目录。如果出错，会返回*PathError底层类型的错误。

```go
func Mkdir(name string, perm FileMode) error
```

2. ***MkdirAll*** MkdirAll使用指定的权限和名称创建一个目录，包括任何必要的上级目录，并返回nil，否则返回错误。权限位perm会应用在每一个被本函数创建的目录上。如果path指定了一个已经存在的目录，MkdirAll不做任何操作并返回nil。

```go
func MkdirAll(path string, perm FileMode) error
```

### 修改文件

1. ***Rename*** Rename修改一个文件的名字，移动一个文件。可能会有一些个操作系统特定的限制。

```go
func Rename(oldpath, newpath string) error
```

2. ***Truncate*** Truncate修改name指定的文件的大小。如果该文件为一个符号链接，将修改链接指向的文件的大小。如果出错，会返回*PathError底层类型的错误。

```go
func Truncate(name string, size int64) error
```

### 删除目录

1. ***Remove*** Remove删除name指定的文件或目录。如果出错，会返回*PathError底层类型的错误。

```go
func Remove(name string) error
```

2. ***RemoveAll*** RemoveAll删除path指定的文件，或目录及它包含的任何下级对象。它会尝试删除所有东西，除非遇到错误并返回。如果path指定的对象不存在，RemoveAll会返回nil而不返回错误

```go
func RemoveAll(path string) error
```

### 其他

1. ***Readlink*** Readlink获取name指定的符号链接文件指向的文件的路径。如果出错，会返回*PathError底层类型的错误。

```go
func Readlink(name string) (string, error)
```

2. ***Symlink*** Symlink创建一个名为newname指向oldname的符号链接。如果出错，会返回* LinkError底层类型的错误。

```go
func Symlink(oldname, newname string) error
```

3. ***Link*** Link创建一个名为newname指向oldname的硬链接。如果出错，会返回* LinkError底层类型的错误。

```go
func Link(oldname, newname string) error
```

4. ***SameFile*** SameFile返回fi1和fi2是否在描述同一个文件。例如，在Unix这表示二者底层结构的设备和索引节点是相同的；在其他系统中可能是根据路径名确定的。SameFile应只使用本包Stat函数返回的FileInfo类型值为参数，其他情况下，它会返回假。

```go
func SameFile(fi1, fi2 FileInfo) bool
```

5. ***TempDir*** TempDir返回一个用于保管临时文件的默认目录。

```go
func TempDir() string
```
