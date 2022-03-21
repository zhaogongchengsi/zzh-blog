---
sidebar_position: 3
---

# 标准库学习 - strings

## strings

### EqualFold 判断两个字符串是否相同
判断两个utf-8编码字符串（将unicode大写、小写、标题三种格式字符视为相同）是否相同。
> 官方
```go
func EqualFold(s, t string) bool
```

> 案例
```go
func main() {
	issame := strings.EqualFold("hello", "hello")
	issame2 := strings.EqualFold("hello", "hell o") // 这里有一个空格
	fmt.Println(issame)                             // true
	fmt.Println(issame2)                            // false
}
```

### 判断前后缀
1. ***HasPrefix*** 判断s是否有前缀字符串prefix。
2. ***HasSuffix*** 判断s是否有后缀字符串suffix。

> 官方
```go
func HasPrefix(s, prefix string) bool
```
```go
func HasSuffix(s, suffix string) bool
```

> 案例
```go
func main() {
	str := strings.HasPrefix("hello", "he")
	str2 := strings.HasPrefix("hello", "ab")
	str3 := strings.HasSuffix("hello", "lo")
	str4 := strings.HasSuffix("hello", "jo")
	fmt.Println(str) // true
	fmt.Println(str2) // false
	fmt.Println(str3) // true
	fmt.Println(str4) // false
}
```

### 判断字符串内容   
1. ***Contains*** 判断字符串s是否包含子串substr。
2. ***ContaineRune*** 判断字符串s是否包含utf-8码值r。
3. ***ContainsAny*** 判断字符串s是否包含字符串chars中的任一字符。
4. ***Count*** 返回字符串s中有几个不重复的sep子串。

> 官方
```go
func Contains(s, substr string) bool
func ContainsRune(s string, r rune) bool
func ContainsAny(s, chars string) bool
func Count(s, sep string) int
```

> 案例
```go
func main() {
	fmt.Println(strings.Contains("hello", "ll"))      // true
	fmt.Println(strings.ContainsRune("a", 90))        // false
	fmt.Println(strings.ContainsAny("hello", "el"))   // true
	fmt.Println(strings.Count("hello", "l"))          // 2
}
```

### 判断位置 
1. ***Index*** 子串sep在字符串s中第一次出现的位置，不存在则返回-1。
2. ***IndexByte*** 字符c在s中第一次出现的位置，不存在则返回-1。
3. ***IndexRune*** unicode码值r在s中第一次出现的位置，不存在则返回-1。
4. ***IndexAny*** 字符串chars中的任一utf-8码值在s中第一次出现的位置，如果不存在或者chars为空字符串则返回-1。
5. ***IndexFunc*** s中第一个满足函数f的位置i（该处的utf-8码值r满足f(r)==true），不存在则返回-1。
6. ***LastIndex*** 子串sep在字符串s中最后一次出现的位置，不存在则返回-1
7. ***LastIndexAny*** 字符串chars中的任一utf-8码值在s中最后一次出现的位置，如不存在或者chars为空字符串则返回-1。
8. ***LastIndexFunc*** s中最后一个满足函数f的unicode码值的位置i，不存在则返回-1

> 官方
```go
func Index(s, sep string) int
func IndexByte(s string, c byte) int
func IndexRune(s string, r rune) int
func IndexAny(s, chars string) int
func IndexFunc(s string, f func(rune) bool) int
func LastIndex(s, sep string) int
func LastIndexAny(s, chars string) int
func LastIndexFunc(s string, f func(rune) bool) int
```

> 案例
```go
func main() {
	fmt.Println(strings.Index("hello", "l"))          // 2
	fmt.Println(strings.IndexByte("hello", 'h'))      // 单字节 '' // 0
	fmt.Println(strings.IndexRune("hello", 'k'))      // -1
	fmt.Println(strings.IndexAny("hello", "l"))       // 2
	fmt.Println(strings.IndexFunc("hello", func(r rune) bool {
		fmt.Println("IndexFunc rune: ", r) // 104
		return true
	})) // 0
	fmt.Println(strings.LastIndex("hello", "h"))    // 0
	fmt.Println(strings.LastIndexAny("hello", "o")) // 4
	fmt.Println(strings.LastIndexFunc("hello", func(r rune) bool {
		fmt.Println("LastIndexFunc rune: ", r) // 111
		return true
	})) // 4
}
```

都是从0 开始

### 更改格式

1. ***Title*** 返回s中每个单词的首字母都改为标题格式的字符串拷贝。BUG: Title用于划分单词的规则不能很好的处理Unicode标点符号。
2. ***ToLower*** 返回将所有字母都转为对应的小写版本的拷贝。
3. ***ToLowerSpecial*** 使用_case规定的字符映射，返回将所有字母都转为对应的小写版本的拷贝。
4. ***ToUpper*** 返回将所有字母都转为对应的大写版本的拷贝。
5. ***ToUpperSpecial*** 使用_case规定的字符映射，返回将所有字母都转为对应的大写版本的拷贝。
6. ***ToTitle*** 返回将所有字母都转为对应的标题版本的拷贝。
7. ***ToTitleSpecial*** 使用_case规定的字符映射，返回将所有字母都转为对应的标题版本的拷贝。

> 官方
```go
func Title(s string) string
func ToLower(s string) string
func ToLowerSpecial(_case unicode.SpecialCase, s string) string
func ToUpper(s string) string
func ToUpperSpecial(_case unicode.SpecialCase, s string) string
func ToTitle(s string) string
func ToTitleSpecial(_case unicode.SpecialCase, s string) string
```

> 案例
```go
func main() {
	fmt.Println(strings.Title("hello world"))                         // Hello World
	fmt.Println(strings.ToLower("HELLO WORLD"))                       // hello world
	fmt.Println(strings.ToLowerSpecial(unicode.TurkishCase, "Hello")) // hello
	fmt.Println(strings.ToUpper("hello world"))                       // HELLO WORLD
	fmt.Println(strings.ToUpperSpecial(unicode.TurkishCase, "Hello")) // HELLO
	fmt.Println(strings.ToTitle("hello world"))                       // HELLO WORLD
	fmt.Println(strings.ToTitleSpecial(unicode.TurkishCase, "Hello")) // HELLO
}
```


### 重复 替换
1. ***Repeat*** 返回count个s串联的字符串。
2. ***Replace*** 返回将s中前n个不重叠old子串都替换为new的新字符串，如果n<0会替换所有old子串。
3. ***Map*** 将s的每一个unicode码值r都替换为mapping(r)，返回这些新码值组成的字符串拷贝。如果mapping返回一个负值，将会丢弃该码值而不会被替换。（返回值中对应位置将没有码值）

> 官方
```go
func Repeat(s string, count int) string
func Replace(s, old, new string, n int) string
func Map(mapping func(rune) rune, s string) string
```

> 案例
```go
func main() {
	fmt.Println("he" + strings.Repeat("l", 2) + "o")              // hello
	fmt.Println(strings.Replace("abcd abcd abcd", "d", "cde", 2)) // abccde abccde abcd
	fmt.Println(strings.Replace("abc abc abc", "abc", "efg", -1)) // efg efg efg
	rot13 := func(r rune) rune {
		switch {
		case r >= 'A' && r <= 'Z':
			return 'A' + (r-'A'+13)%26
		case r >= 'a' && r <= 'z':
			return 'a' + (r-'a'+13)%26
		}
		return r
	}
	fmt.Println(strings.Map(rot13, "'Twas brillig and the slithy gopher...")) // 'Gjnf oevyyvt naq gur fyvgul tbcure...
}
```

### 删除
1. ***Trim*** 返回将s前后端所有cutset包含的utf-8码值都去掉的字符串。
2. ***TrimSpace*** 返回将s前后端所有空白（unicode.IsSpace指定）都去掉的字符串。
3. ***TrimFunc*** 返回将s前后端所有满足f的unicode码值都去掉的字符串。
4. ***TrimLeft*** 返回将s前端所有cutset包含的utf-8码值都去掉的字符串。
5. ***TrimLeftFunc*** 返回将s前端所有满足f的unicode码值都去掉的字符串。
6. ***TrimPrefix*** 返回去除s可能的前缀prefix的字符串。
7. ***TrimRight*** 返回将s后端所有cutset包含的utf-8码值都去掉的字符串。
8. ***TrimRightFunc*** 返回将s后端所有满足f的unicode码值都去掉的字符串。
9. ***TrimSuffix*** 返回去除s可能的后缀suffix的字符串。

> 官方
```go
func Trim(s string, cutset string) string
func TrimSpace(s string) string
func TrimFunc(s string, f func(rune) bool) string
func TrimLeft(s string, cutset string) string
func TrimLeftFunc(s string, f func(rune) bool) string
func TrimPrefix(s, prefix string) string
func TrimRight(s string, cutset string) string
func TrimRightFunc(s string, f func(rune) bool) string
func TrimSuffix(s, suffix string) string
```

> 案例
```go
func main() {
	fmt.Println(strings.Trim("helloh", "h"))    // ello
	fmt.Println(strings.TrimSpace("  hello  ")) // hello
	fmt.Println(strings.TrimFunc("hello", func(r rune) bool {
		fmt.Println("TrimFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimLeft("hello", "he")) // llo
	fmt.Println(strings.TrimLeftFunc("hello", func(r rune) bool {
		fmt.Println("TrimLeftFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimPrefix("hello", "h")) // ello
	fmt.Println(strings.TrimRight("hello", "o"))  // hell
	fmt.Println(strings.TrimRightFunc("hello", func(r rune) bool {
		fmt.Println("TrimRightFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimSuffix("hello", "o")) // hell
}
```

### 分割
1. ***Fields*** 返回将字符串按照空白（unicode.IsSpace确定，可以是一到多个连续的空白字符）分割的多个字符串。如果字符串全部是空白或者是空字符串的话，会返回空切片。
2. ***FieldsFunc*** 类似Fields，但使用函数f来确定分割符（满足f的unicode码值）。如果字符串全部是分隔符或者是空字符串的话，会返回空切片。
3. ***Split*** 用去掉s中出现的sep的方式进行分割，会分割到结尾，并返回生成的所有片段组成的切片（每一个sep都会进行一次切割，即使两个sep相邻，也会进行两次切割）。如果sep为空字符，Split会将s切分成每一个unicode码值一个字符串
4. ***SplitN*** 用去掉s中出现的sep的方式进行分割，会分割到结尾，并返回生成的所有片段组成的切片（每一个sep都会进行一次切割，即使两个sep相邻，也会进行两次切割）。如果sep为空字符，Split会将s切分成每一个unicode码值一个字符串。参数n决定返回的切片的数目：
- n > 0 : 返回的切片最多n个子字符串；最后一个子字符串包含未进行切割的部分。
- n == 0: 返回nil
- n < 0 : 返回所有的子字符串组成的切片
5. ***SplitAfter*** 用从s中出现的sep后面切断的方式进行分割，会分割到结尾，并返回生成的所有片段组成的切片（每一个sep都会进行一次切割，即使两个sep相邻，也会进行两次切割）。如果sep为空字符，Split会将s切分成每一个unicode码值一个字符串。
6. ***SplitAfterN*** 用从s中出现的sep后面切断的方式进行分割，会分割到结尾，并返回生成的所有片段组成的切片（每一个sep都会进行一次切割，即使两个sep相邻，也会进行两次切割）。如果sep为空字符，Split会将s切分成每一个unicode码值一个字符串。参数n决定返回的切片的数目：
- n > 0 : 返回的切片最多n个子字符串；最后一个子字符串包含未进行切割的部分。
- n == 0: 返回nil
- n < 0 : 返回所有的子字符串组成的切

> 官方
```go
func Fields(s string) []string
func FieldsFunc(s string, f func(rune) bool) []string
func Split(s, sep string) []string
func SplitN(s, sep string, n int) []string
func SplitAfter(s, sep string) []string
func SplitAfterN(s, sep string, n int) []string
```

> 案例
```go
func main() {
	fmt.Printf("Fields are: %q", strings.Fields("  foo bar  baz   ")) // Fields are: ["foo" "bar" "baz"]Fields are: ["foo1" "bar2" "baz3"]["a" "b" "c"]
	f := func(c rune) bool {
		return !unicode.IsLetter(c) && !unicode.IsNumber(c)
	}
	fmt.Printf("Fields are: %q", strings.FieldsFunc("  foo1;bar2,baz3...", f)) // ["a" "b,c"]
	fmt.Printf("%q\n", strings.Split("a,b,c", ","))
	fmt.Printf("%q\n", strings.SplitN("a,b,c", ",", 2))  // ["a," "b," "c"]
	fmt.Printf("%q\n", strings.SplitAfter("a,b,c", ",")) // ["a," "b,c"]
	fmt.Printf("%q\n", strings.SplitAfterN("a,b,c", ",", 2)) // 
}
```

### 连接
1. Join 将一系列字符串连接为一个字符串，之间用sep来分隔。

> 官方
```go
func Join(a []string, sep string) string
```

> 案例
```go
s := []string{"foo", "bar", "baz"}
fmt.Println(strings.Join(s, ", ")) // foo, bar, baz
```

#### 完整案例

```go
package main
import (
	"fmt"
	"strings"
	"unicode"
)
func main() {
	fmt.Println(strings.EqualFold("hello", "hello"))  // true
	fmt.Println(strings.EqualFold("hello", "hell o")) // 这里又一个空格 false
	fmt.Println(strings.HasPrefix("hello", "he"))     // true
	fmt.Println(strings.HasPrefix("hello", "ab"))     // false
	fmt.Println(strings.HasSuffix("hello", "lo"))     // true
	fmt.Println(strings.HasSuffix("hello", "jo"))     // false
	fmt.Println(strings.Contains("hello", "ll"))      // true
	fmt.Println(strings.ContainsRune("a", 97))        // true
	fmt.Println(strings.ContainsAny("hello", "el"))   // true
	fmt.Println(strings.Count("hello", "l"))          // 2
	fmt.Println(strings.Index("hello", "l"))          // 2
	fmt.Println(strings.IndexByte("hello", 'h'))      // 单字节 '' // 0
	fmt.Println(strings.IndexRune("hello", 'k'))      // -1
	fmt.Println(strings.IndexAny("hello", "l"))       // 2
	fmt.Println(strings.IndexFunc("hello", func(r rune) bool {
		fmt.Println("IndexFunc rune: ", r) // 104
		return true
	})) // 0
	fmt.Println(strings.LastIndex("hello", "h"))    // 0
	fmt.Println(strings.LastIndexAny("hello", "o")) // 4
	fmt.Println(strings.LastIndexFunc("hello", func(r rune) bool {
		fmt.Println("LastIndexFunc rune: ", r) // 111
		return true
	})) // 4
	fmt.Println(strings.Title("hello world"))                         // Hello World
	fmt.Println(strings.ToLower("HELLO WORLD"))                       // hello world
	fmt.Println(strings.ToLowerSpecial(unicode.TurkishCase, "Hello")) // hello
	fmt.Println(strings.ToUpper("hello world"))                       // HELLO WORLD
	fmt.Println(strings.ToUpperSpecial(unicode.TurkishCase, "Hello")) // HELLO
	fmt.Println(strings.ToTitle("hello world"))                       // HELLO WORLD
	fmt.Println(strings.ToTitleSpecial(unicode.TurkishCase, "Hello")) // HELLO
	fmt.Println("he" + strings.Repeat("l", 2) + "o")                  // hello
	fmt.Println(strings.Replace("abcd abcd abcd", "d", "cde", 2))     // abccde abccde abcd
	fmt.Println(strings.Replace("abc abc abc", "abc", "efg", -1))     // efg efg efg
	rot13 := func(r rune) rune {
		switch {
		case r >= 'A' && r <= 'Z':
			return 'A' + (r-'A'+13)%26
		case r >= 'a' && r <= 'z':
			return 'a' + (r-'a'+13)%26
		}
		return r
	}
	fmt.Println(strings.Map(rot13, "'Twas brillig and the slithy gopher...")) // 'Gjnf oevyyvt naq gur fyvgul tbcure...

	fmt.Println(strings.Trim("helloh", "h"))    // ello
	fmt.Println(strings.TrimSpace("  hello  ")) // hello
	fmt.Println(strings.TrimFunc("hello", func(r rune) bool {
		fmt.Println("TrimFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimLeft("hello", "he")) // llo
	fmt.Println(strings.TrimLeftFunc("hello", func(r rune) bool {
		fmt.Println("TrimLeftFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimPrefix("hello", "h")) // ello
	fmt.Println(strings.TrimRight("hello", "o"))  // hell
	fmt.Println(strings.TrimRightFunc("hello", func(r rune) bool {
		fmt.Println("TrimRightFunc rune:", r)
		return true
	}))
	fmt.Println(strings.TrimSuffix("hello", "o"))                     // hell
	fmt.Printf("Fields are: %q", strings.Fields("  foo bar  baz   ")) // Fields are: ["foo" "bar" "baz"]Fields are: ["foo1" "bar2" "baz3"]["a" "b" "c"]
	f := func(c rune) bool {
		return !unicode.IsLetter(c) && !unicode.IsNumber(c)
	}
	fmt.Printf("Fields are: %q", strings.FieldsFunc("  foo1;bar2,baz3...", f)) // ["a" "b,c"]
	fmt.Printf("%q\n", strings.Split("a,b,c", ","))
	fmt.Printf("%q\n", strings.SplitN("a,b,c", ",", 2))      // ["a," "b," "c"]
	fmt.Printf("%q\n", strings.SplitAfter("a,b,c", ","))     // ["a," "b,c"]
	fmt.Printf("%q\n", strings.SplitAfterN("a,b,c", ",", 2)) //
	s := []string{"foo", "bar", "baz"}
	fmt.Println(strings.Join(s, ", ")) // foo, bar, baz
}
```