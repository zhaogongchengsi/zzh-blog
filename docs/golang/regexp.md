---
sidebar_position: 4
---

# 标准库学习 - regexp

## regexp

```go
type Regexp struct {
    // 内含隐藏或非导出字段
}
```

### 从字符串到正则
1. ***QuoteMeta*** QuoteMeta返回将s中所有正则表达式元字符都进行转义后字符串。该字符串可以用在正则表达式中匹配字面值s。例如，QuoteMeta(`[foo]`)会返回`\[foo\]`。

2. ***Compile*** Compile解析并返回一个正则表达式。如果成功返回，该Regexp就可用于匹配文本。
在匹配文本时，该正则表达式会尽可能早的开始匹配，并且在匹配过程中选择回溯搜索到的第一个匹配结果。这种模式被称为“leftmost-first”，Perl、Python和其他实现都采用了这种模式，但本包的实现没有回溯的损耗。对POSIX的“leftmost-longest”模式，参见CompilePOSIX

3. ***CompilePOSIX*** 类似Compile但会将语法约束到POSIX ERE（egrep）语法，并将匹配模式设置为leftmost-longest。在匹配文本时，该正则表达式会尽可能早的开始匹配，并且在匹配过程中选择搜索到的最长的匹配结果。这种模式被称为“leftmost-longest”，POSIX采用了这种模式（早期正则的DFA自动机模式）。然而，可能会有多个“leftmost-longest”匹配，每个都有不同的组匹配状态，本包在这里和POSIX不同。在所有可能“leftmost-longest”匹配里，本包选择回溯搜索时第一个找到的，而POSIX会选择候选结果中第一个组匹配最长的（可能有多个），然后再从中选出第二个组匹配最长的，依次类推。POSIX规则计算困难，甚至没有良好定义。

4. ***MustCompile*** MustCompile类似Compile但会在解析失败时panic，主要用于全局正则表达式变量的安全初始化

5. ***MustCompilePOSIX*** MustCompilePOSIX类似CompilePOSIX但会在解析失败时panic，主要用于全局正则表达式变量的安全初始化

> 官方
```go
func QuoteMeta(s string) string
func Compile(expr string) (*Regexp, error)
func CompilePOSIX(expr string) (*Regexp, error)
func MustCompile(str string) *Regexp
func MustCompilePOSIX(str string) *Regexp
```


### 从正则到字符串
1. ***String*** String返回用于编译成正则表达式的字符串
2. ***LiteralPrefix*** LiteralPrefix返回一个字符串字面值prefix，任何匹配本正则表达式的字符串都会以prefix起始。 如果该字符串字面值包含整个正则表达式，返回值complete会设为真

> 官方
```go
func (re *Regexp) String() string
func (re *Regexp) LiteralPrefix() (prefix string, complete bool)
```


### 正则匹配
1. ***Longest Longest*** 让正则表达式在之后的搜索中都采用"leftmost-longest"(贪婪模式)模式。在匹配文本时，该正则表达式会尽可能早的开始匹配，并且在匹配过程中选择搜索到的最长的匹配结果
2. ***Match*** Match检查b中是否存在匹配pattern的子序列
3. ***MatchString*** MatchString类似Match，但匹配对象是字符串
4. ***MatchReader*** MatchReader类似Match，但匹配对象是io.RuneReader

> 官方
```go
func (re *Regexp) Longest()
func (re *Regexp) Match(b []byte) bool
func (re *Regexp) MatchString(s string) bool
func (re *Regexp) MatchReader(r io.RuneReader) bool
```

### 正则搜索
1. ***Find Find*** 返回保管正则表达式re在b中的最左侧的一个匹配结果的[]byte切片。如果没有匹配到，会返回nil
```go
func (re *Regexp) Find(b []byte) []byte
```

2. ***FindString*** Find返回保管正则表达式re在b中的最左侧的一个匹配结果的字符串。如果没有匹配到，会返回""；但如果正则表达式成功匹配了一个空字符串，也会返回""。如果需要区分这种情况，请使用FindStringIndex 或FindStringSubmatch
```go
func (re *Regexp) FindString(s string) string
```

3. ***FindIndex*** Find返回保管正则表达式re在b中的最左侧的一个匹配结果的起止位置的切片（显然len(loc)==2）。匹配结果可以通过起止位置对b做切片操作得到：b[loc[0]:loc[1]]。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindIndex(b []byte) (loc []int)
```

4. ***FindStringIndex*** Find返回保管正则表达式re在b中的最左侧的一个匹配结果的起止位置的切片（显然len(loc)==2）。匹配结果可以通过起止位置对b做切片操作得到：b[loc[0]:loc[1]]。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindStringIndex(s string) (loc []int)
```

5. ***FindReaderIndex***Find返回保管正则表达式re在b中的最左侧的一个匹配结果的起止位置的切片（显然len(loc)==2）。匹配结果可以在输入流r的字节偏移量loc[0]到loc[1]-1（包括二者）位置找到。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindReaderIndex(r io.RuneReader) (loc []int)
```

6. ***FindSubmatch*** 
Find返回一个保管正则表达式re在b中的最左侧的一个匹配结果以及（可能有的）分组匹配的结果的[][]byte切片。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindSubmatch(b []byte) [][]byte
```

7. ***FindStringSubmatch*** Find返回一个保管正则表达式re在b中的最左侧的一个匹配结果以及（可能有的）分组匹配的结果的[]string切片。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindStringSubmatch(s string) []string
```

8. ***FindSubmatchIndex*** Find返回一个保管正则表达式re在b中的最左侧的一个匹配结果以及（可能有的）分组匹配的结果的起止位置的切片。匹配结果和分组匹配结果可以通过起止位置对b做切片操作得到：b[loc[2*n]:loc[2*n+1]]。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindSubmatchIndex(b []byte) []int
```

9. ***FindStringSubmatchIndex*** Find返回一个保管正则表达式re在b中的最左侧的一个匹配结果以及（可能有的）分组匹配的结果的起止位置的切片。匹配结果和分组匹配结果可以通过起止位置对b做切片操作得到：b[loc[2*n]:loc[2*n+1]]。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindStringSubmatchIndex(s string) []int
```

10. ***FindAll*** Find返回保管正则表达式re在b中的所有不重叠的匹配结果的[][]byte切片。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindAll(b []byte, n int) [][]byte
```

11. ***FindAllString*** Find返回保管正则表达式re在b中的所有不重叠的匹配结果的[]string切片。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindAllString(s string, n int) []string
```

12. ***FindAllIndex*** Find返回保管正则表达式re在b中的所有不重叠的匹配结果的起止位置的切片。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindAllIndex(b []byte, n int) [][]int
```

13. ***FindAllStringIndex*** Find返回保管正则表达式re在b中的所有不重叠的匹配结果的起止位置的切片。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindAllStringIndex(s string, n int) [][]int
```

14. ***FindAllSubmatch*** Find返回一个保管正则表达式re在b中的所有不重叠的匹配结果及其对应的（可能有的）分组匹配的结果的[][][]byte切片。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindAllSubmatch(b []byte, n int) [][][]byte
```

15. ***FindAllSubmatchIndex*** Find返回一个保管正则表达式re在b中的所有不重叠的匹配结果及其对应的（可能有的）分组匹配的结果的起止位置的切片（第一层表示第几个匹配结果，完整匹配和分组匹配的起止位置对在第二层）。如果没有匹配到，会返回nil。
```go
func (re *Regexp) FindAllSubmatchIndex(b []byte, n int) [][]int
```

16. ***FindAllStringSubmatchIndex*** Find返回一个保管正则表达式re在b中的所有不重叠的匹配结果及其对应的（可能有的）分组匹配的结果的起止位置的切片（第一层表示第几个匹配结果，完整匹配和分组匹配的起止位置对在第二层）。如果没有匹配到，会返回nil
```go
func (re *Regexp) FindAllStringSubmatchIndex(s string, n int) [][]int
```


### 正则分割
1. ***Split Split*** 将re在s中匹配到的结果作为分隔符将s分割成多个字符串，并返回这些正则匹配结果之间的字符串的切片。返回的切片不会包含正则匹配的结果，只包含匹配结果之间的片段。当正则表达式re中不含正则元字符时，本方法等价于strings.SplitN
```go
func (re *Regexp) Split(s string, n int) []strings
```

### 正则替换
1. ***Expand*** Expand返回新生成的将template添加到dst后面的切片。在添加时，Expand会将template中的变量替换为从src匹配的结果。match应该是被FindSubmatchIndex返回的匹配结果起止位置索引。（通常就是匹配src，除非你要将匹配得到的位置用于另一个[]byte 在template参数里，一个变量表示为格式如：$name或${name}的字符串，其中name是长度>0的字母、数字和下划线的序列。一个单纯的数字字符名如$1会作为捕获分组的数字索引；其他的名字对应语法产生的命名捕获分组的名字。超出范围的数字索引、索引对应的分组未匹配到文本、正则表达式中未出现的分组名，都会被替换为空切片。$name格式的变量名，name会尽可能取最长序列：$1x等价于${1x}而非${1}x，$10等价于${10}而非${1}0。因此$name适用在后跟空格/换行等字符的情况，${name}适用所有情况。如果要在输出中插入一个字面值'$'，在template里可以使用$$
```go
func (re *Regexp) Expand(dst []byte, template []byte, src []byte, match []int) []byte
```

2. ***ExpandString*** ExpandString类似Expand，但template和src参数为字符串。它将替换结果添加到切片并返回切片，以便让调用代码控制内存申请
```go
func (re *Regexp) ExpandString(dst []byte, template string, src string, match []int) []byte
```

3. ***ReplaceAllLiteral*** ReplaceAllLiteral返回src的一个拷贝，将src中所有re的匹配结果都替换为repl。repl参数被直接使用，不会使用Expand进行扩展
```go
func (re *Regexp) ReplaceAllLiteral(src, repl []byte) []byte
```


4. ***ReplaceAllLiteralString*** ReplaceAllLiteralString返回src的一个拷贝，将src中所有re的匹配结果都替换为repl。repl参数被直接使用，不会使用Expand进行扩展
```go
func (re *Regexp) ReplaceAllLiteralString(src, repl string) string
```

5. ***ReplaceAll*** ReplaceAllLiteral返回src的一个拷贝，将src中所有re的匹配结果都替换为repl。在替换时，repl中的'$'符号会按照Expand方法的规则进行解释和替换，例如$1会被替换为第一个分组匹配结果
```go
func (re *Regexp) ReplaceAll(src, repl []byte) []byte
```

6. ***ReplaceAllString*** ReplaceAllLiteral返回src的一个拷贝，将src中所有re的匹配结果都替换为repl。在替换时，repl中的'$'符号会按照Expand方法的规则进行解释和替换，例如$1会被替换为第一个分组匹配结果。
```go
func (re *Regexp) ReplaceAllString(src, repl string) string
```

7. ***ReplaceAllFunc*** ReplaceAllLiteral返回src的一个拷贝，将src中所有re的匹配结果（设为matched）都替换为repl(matched)。repl返回的切片被直接使用，不会使用Expand进行扩展。
```go
func (re *Regexp) ReplaceAllFunc(src []byte, repl func([]byte) []byte) []byte
```

8. ***ReplaceAllStringFunc*** ReplaceAllLiteral返回src的一个拷贝，将src中所有re的匹配结果（设为matched）都替换为repl(matched)。repl返回的字符串被直接使用，不会使用Expand进行扩展
```go
func (re *Regexp) ReplaceAllStringFunc(src string, repl func(string) string) string
```
