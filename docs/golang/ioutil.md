---
sidebar_position: 2
---

# Golang 标准库学习 - ioutil

## ioutil 

> ```EOF``` 当函数一切正常的到达输入的结束时，就应返回EOF。如果在一个结构化数据流中EOF在不期望的位置出现 了，则应返回错误ErrUnexpectedEOF或者其它给出更多细节的错误（说明这东西会在文件的末尾出生）
```go
var EOF = errors.New("EOF")
```

### ReadFile 从指定的文件中读取数据

> 官方定义
```go
func ReadFile(filename string) ([]byte, error)
```
从filename 指定的文件中读取数据并返回文件内容， 成功调用返回err 为 nil 而非 EOF。因为本函数定义为读取整个文件，它不会将读取返回的EOF视为应报告的错误。

> 案例
```go
func main() {
	file, err := ioutil.ReadFile("go_test/text")
	if err != nil {
		fmt.Println("hello world")
	}
    // string 将读取的byte 转化为 字符串
	fmt.Println(string(file))
    // 读取的案例 
}
```

### WriteFile 向指定文件写入数据

> 官方定义
```go
func WriteFile(filename string, data []byte, perm os.FileMode) error
```
函数向filename指定的文件中写入数据。如果文件不存在将按给出的权限创建文件，否则在写入数据之前清空文件。

> 案例
```go
func main() {
	err = ioutil.WriteFile("go_test/text2", file, 0644)
	if err != nil {
		fmt.Println("写入错误")
	}
}
```

### ReadDir 返回指定目录的目录信息列表

> 官方定义
```go
func ReadDir(dirname string) ([]os.FileInfo, error)
```

> 例子
```go
func main() {
	fileinfo, err2 := ioutil.ReadDir("go_test")
	if err2 != nil {
		fmt.Println("获取目录信息错误")
	}
	fmt.Println(fileinfo)
}
```


### TempDir | TempFile

- TemeDir
```go
func TempDir(dir, prefix string) (name string, err error)
```
在dir目录里创建一个新的、使用prfix作为前缀的临时文件夹，并返回文件夹的路径。如果dir是空字符串，TempDir使用默认用于临时文件的目录（参见os.TempDir函数）。 不同程序同时调用该函数会创建不同的临时目录，调用本函数的程序有责任在不需要临时文件夹时摧毁它。
- TempFile
```go
func TempFile(dir, prefix string) (f *os.File, err error)
```
在dir目录下创建一个新的、使用prefix为前缀的临时文件，以读写模式打开该文件并返回os.File指针。如果dir是空字符串，TempFile使用默认用于临时文件的目录（参见os.TempDir函数）。不同程序同时调用该函数会创建不同的临时文件，调用本函数的程序有责任在不需要临时文件时摧毁它

这两个方法用于创建临时文件和文件夹没啥好举例子的

#### 完整的例子
```go
package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	file, err := ioutil.ReadFile("go_test/text")
	if err != nil {
		fmt.Println("读取错误")
	}
	fmt.Println(string(file))
	err = ioutil.WriteFile("go_test/text2", file, 0644)
	if err != nil {
		fmt.Println("写入错误")
	}
	fileinfo, err2 := ioutil.ReadDir("go_test")
	if err2 != nil {
		fmt.Println("获取目录信息错误")
	}
	fmt.Println(fileinfo)
}
```