# React 生命周期



| 状态                | 类组件                                                       | 函数组件                                                     |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
|                     | constructor                                                  |                                                              |
|                     | `componentWillMount` (即将挂在到页面时执行)                  |                                                              |
| Mounting 挂载时     | `render` 页面state或props发生变化时执行                      |                                                              |
|                     | `componentDidMount` 组件挂载完成之后执行                     | `useEffect(() => {   console.log('') }, [])`                 |
|                     | `shouldComponentUpdate` 该函数会在组件更新之前，返回 false 则不更新 |                                                              |
| Updating 更新阶段   | `componetWillUpdate` `shouldComponentUpdate`  返回true后执行 |                                                              |
|                     | `componentDidupdate` 组件更新之后执行 更新的最后环节         | `useEffect(() => {    console.log('n变化了')}, [n])` |
| Unmounting 卸载阶段 | componentWillUnmount 卸载时执行                              | `useEffect(() => () => { console.log('该组件要销毁了')})` |

#### 常用生命周期

![react 生命周期](/img/react_lifecycles.png)

#### 不常用生命周期

![react 生命周期](/img/react2.png)