$(function () {

  var $content = $('.content');
  var $header = $('.header');
  var $contentList = $('.contentList');
  var $lis = $('.contentList>li');
  var $pointNavs = $('.pointNav>li');
  var $navList = $('.navList>li');
  var index = 0;
  var moving = false;

  /* 指定内容区高度 */
  var contentHeight =document.documentElement.clientHeight - $header.outerHeight();
  $content.css('height',contentHeight);
  $.each($lis,function (index, li) {
    $(li).css('height',contentHeight)
  });

  /* 导航点击事件 */
  $pointNavs.click(function () {
    var targetIndex = $(this).index();
    if(targetIndex!=index) {
      move(targetIndex)
    }
  });
  $navList.click(function () {
    var targetIndex = $(this).index();
    if(targetIndex!=index) {
      move(targetIndex)
    }
  });

  /* 滚轮事件 */
  $content.on('mousewheel DOMMouseScroll', function (e) {
    e = e || event;
    // chrome 和 ie   e.originalEvent.wheelDelta > 0 (滚轮向上)
    // firefox        e.originalEvent.detail < 0   (滚轮向上)
    var delta = (e.originalEvent.wheelDelta > 0 ? 1 : -1) || (e.originalEvent.detail > 0 ? -1 : 1)

    if (delta > 0) {  // 滚轮向上
      move(false)
    }else if (delta < 0) {  // 滚轮向下
      move(true)
    }
    //  取消滚轮的默认行为
    window.event? window.event.returnValue = false : e.preventDefault()
  });

  /* li的移动与相应动画 */
  function move(next) {
    // 禁止过渡没有完成时翻页
    if (moving){
      return
    }
    // 当前top
    var currTop = $contentList.position().top;
    // 目标top
    var targetTop = 0;
    // 确定移动距离
    var offset = 0;
    if (typeof next === 'boolean'){
      offset = next ? -contentHeight : contentHeight
    }else {
      offset = -(next-index) * contentHeight
    }
    targetTop = offset + currTop;
    moving = true;
    // 边界值
    if (typeof next === 'boolean'){
      if(currTop === -contentHeight*4 && next){ // 下
        targetTop = currTop;
        moving = false
      }else if (currTop === 0 && !next){ // 上
        targetTop = 0;
        moving = false
      }
    }
    // 移动
    $contentList.css('top',targetTop );

    // 更新
    update(next);

    // 监测过渡结束
    $contentList.on('transitionEnd',transitionEnd);
    $contentList.on('webkitTransitionEnd',transitionEnd);
  }

  // 过渡结束
  function transitionEnd() {
    moving = false
  }

  //更新导航
  function update(next) {
    var targetIndex = 0;
    if (typeof next === 'boolean'){
      targetIndex = index + (next?1:-1)
    }else {
      targetIndex = next
    }

    if (targetIndex<0){
      targetIndex = 0
    }else if (targetIndex>4){
      targetIndex = 4
    }
    // 更新导航的选中效果
    $navList[index].className = ''
    $navList[targetIndex].className = 'active'
    $pointNavs[index].className = ''
    $pointNavs[targetIndex].className = 'active'
    index = targetIndex
  }
  
})