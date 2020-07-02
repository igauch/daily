[History-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

老板说当用户返回的时候给他看广告！
我。。。
嗯。。。我研究研究

> HTML5引入了 history.pushState() 和 history.replaceState() 方法，它们分别可以添加和修改历史记录条目。这些方法通常与window.onpopstate 配合使用。

嗯，确实可以实现老板的需求
`pushState`可以向历史记录里添加记录，虽然这个记录的链接必须是同源的，但总还在我们的势力范围内是不是，那我们就可以为所欲为（狡黠的微笑）
计划是这样的
1. pushState一条记录
2. 用户返回的时候触发了popstate事件，我们在回调里直接用location.href = '广告'
3. done

另外，总结下官方外的野认知
1. `pushState`如同`push`一样，是追加，后pushState的总在更新（不是update的更新，是更新！）的历史记录里
2. 只有当处于激活状态的历史记录条目发生变化时,popstate事件才会在对应window对象上触发,也就是说popstate事件是在页面前进或后退 **后** 才被触发的
3. `pushState`和`replaceState`并不会刷新页面或者重新请求，只是更改了历史记录条目和url
