 # 加油站公共组件使用说明
 ## 1.NotFound(404页面组件)
   > - 组件使用场景：当路由找不到时跳转到404页面
   > - 参数：不需要传参
   > - 使用方法：<Route path="/404" component={NotFound} />或<NotFound />
   
 ## 2.AppIcon(Icon图标组件)
   > - 组件使用场景：左侧菜单栏的图标处理
   > - 参数：type(必传，string类型，指定图标类型)、style(object类型，指定图标样式)
   > - 使用方法：<AppIcon type='***' />
   
 ## 3.AppMap(地图组件)
   > - 组件使用场景：用于地图显示及选择地理位置
   > - 参数：maptype(必传，枚举类型，可选值为'read'-只读状态, 'write'-编辑状态)、
       title(string类型，write状态下使用，文本框placeholder提示名称)、
       lnglat(必传，array类型，经纬度，read状态下使用，[经度,纬度])、address(string类型，
       地址名称显示)、clickMarker(编辑状态下必传，回调函数，点击地图图标触发事件，write状态下使用)、
       form(编辑状态下必传，回调函数，父级组件中的form属性)
   > - 使用方法：<AppMap maptype="write" title="**" clickMarker={this.clickMarker} 
       form={this.props.form} lnglat=[x1,x2] address="**" />
       
 ## 4.AppTabs(tab切换组件)
   > - 组件使用场景：更改原Tab切换分离内容部分，将tab栏显示在header部分，将tab对应的内容显示
       在content部分，且两者样式不一样
   > - 参数：tabobj(必传，原tab组件的属性，设置tab的初始选中状态等，)、tabs(必传，由对象构
       成的数组，对象中包含字段：key-string类型-指定tab对应的key值，title-string类型-指
       定tab对应显示的文本、handleClick-回调函数-tab切换函数)
   > - 使用方法：<AppTabs tabobj={tabobj对象} tabs={tabs数组}/>
   
 ## 5.BreadcrumbCustom(面包屑组件)
   > - 组件使用场景：页面顶部的导航目录显示，最多三级(前期用，后期更改掉了)
   > - 参数：first(一级导航)、second(二级导航)、third(三级导航)，根据需要判断是否传导航向，
       但如果都不传就没有使用该组件的必要性了
   > - 使用方法：<BreadcrumbCustom first="会员中心" second="会员列表" third="会员详情" />
   
 ## 6.ContentHeader(公共内容头部组件)
   > - 组件使用场景：面包屑加标题场景
   > - 参数：title(string类型，显示标题-如果不指定则不显示标题)、tipTitle(string类型，标题
       title下的说明文字)、routes(对象型数组，{title: 面包屑显示标题, path: 面包屑对应路由
       url(如果没有则不指定path项)})、children(面包屑可包含element做孩子)、tip(object类，
       型，mobile相关判断) ps:该组件已在APP.js中统一引用，利用redux数据传递，直接传数据对象
       放到redux即可，具体参考每个页面里的使用方法。
   > - 使用方法：<ContentHeader title="*" routes=[{title: '会员卡设置', path: 
         pageIndex?'/main/member_center/member_card_setting/'+pageIndex:
        '/main/member_center/member_card_setting'}]/>
        
 ## 7.DataCard(数字卡片组件)
   > - 组件使用场景：数据统计模块，icon可有可无，参考首页的数据概览
   > - 参数：data(必传，对象型的数组，data = [{'title':'统计对应文本描述','amount':'统计
       对应数值*','icon':'统计对应icon'}])、colNum(枚举类型，一行放几个统计结果，可选值3, 
       4, 6, 8，默认4)、showPosition(枚举，可选值'showSpaceBetween', 'showCenter'，
       默认showSpaceBetween,在icon存在的情况下定义左右icon与文本是水平居中showCenter还
       是两边分散showSpaceBetween，默认两边分散)、showTextAlign(枚举，可选值'alignRight',
        'alignLeft', 'alignCenter'，默认alignRight，右侧上下文本是左对齐、居中还是右对齐
        alignLeft、alignRight、alignCenter，默认右对齐)
   > - 使用方法：<DataCard data=[{'title':'**','amount':'**','icon':'*'}]>
       </DataCard>
       
 ## 8.DetailShowComplex(复合详情组件，可以根据需要包含头部标题，头部按钮，尾部标题)
   > - 组件使用场景：复合详情组件，可以根据需要包含头部标题，头部按钮，尾部标题；详情部分可水平多
       列排布也可垂直一列排布，一列排布时支持居左和居中排布
   > - 参数：headerHave(bool型，是否有头部，默认false)、footerHave(bool型，是否有尾部，默
       认false)、titleName(string型，头部标题，默认为空)、btnTitle(bool型，头部是否有按钮，
       默认false)、direction(枚举，可选'level','vertical'，默认vertical，详情页是水平多
       列还是垂直一列显示)、showPosition(枚举，可选'showLeft','showCenter'，默认
       showCenter，垂直一列时是居左还是居中显示)、colNum(枚举，可选3,4，默认4，水平显示时一
       行是3个还是4个)、customClass(string型，自定义样式类名)、data(map型的数据源，如
       data:new Map([['*','*'],['地址*','*.jpg'], ['*','33.27,116.57 ']])，地址对应
       的value中前一个为latitude(维度)，后一个为longitude(经度)值,即经纬度拼成一个字符串对
       应key的一个value)
   > - 使用方法：<DetailShowComplex headerHave={true} footerHave={true} 
       titleName="标题11" btnTitle={true} data ={data} direction="vertical" 
       showPosition="showCenter"><div>头部按钮</div> <div>尾部按钮</div>
       </DetailShowComplex> ps：更多实际用法可参考组件说明。
       
 ## 9.DetailShowSimple(简单详情组件)
   > - 组件使用场景：不带头部标题-头部按钮-尾部标题的详情展示
   > - 参数：direction(横向-level、纵向-vertical，默认vertical)、data数据源(必须以map的
       key-value形式传data)、showPosition(详情垂直居左显示还是垂直居中显示showLeft、
       showCenter，默认showCenter)、colNum（水平排列时一行几列，可选值3,4，默认4）
       data:new Map([['*','*'],['地址*','*.jpg'], ['*','33.27,116.57 ']])默认地址
       对应的value中前一个为latitude(维度)，后一个为longitude(经度)值
   > - 使用方法：<DetailShowSimple data ={data} direction="vertical" showPosition="showCenter">
       </DetailShowSimple>
   
 ## 10.HeaderCustom(顶部导航组件)
   > - 组件使用场景：
   > - 参数：menus(必传，array型，)、others(必传，array型，)
   > - 使用方法：
   
 ## 11.SiderCustom(左边菜单组件)
   > - 组件使用场景：
   > - 参数：menus(必传，array型，)、others(必传，array型，)、pathname(string型)
   > - 使用方法：
   
 ## 12.NoData(暂无数据组件)
   > - 组件使用场景：当没有数据返回时显示的组件
   > - 参数：title(string型，暂无内容之类的文本显示，默认显示暂无内容)
   > - 使用方法：<NoData />
   
 ## 13.NumberCard(数据统计卡片)
   > - 组件使用场景：用于展示key-value形式的数据,可参考订单列表的统计数据显示
   > - 参数：numberData(必传，object型，包含key-value键值对)
   > - 使用方法：dd = new Map().set('积分', 33).set('订单总数', 22)
       <NumberCard numberData={dd} />
   
 ## 14.Panel(内容框组件)
   > - 组件使用场景：内容区域的content整体样式控制
   > - 参数：panelHeader(bool型，是否有头部，默认true)、headerBtnHtml(element型，头部右侧按钮html)、
       title(string或node型，头部标题，可以为字符串，也可以为node类型)、panelFooter(bool型，是否有底
       部，默认false)、footerBtnHtml(element型，底部按钮html)、bordered(bool型，是否有边框，默认
       false)、innerType(枚举，可选"inner",""，默认"")
   > - 使用方法：<Panel title="内容区"></Panel>
   
 ## 15.QrcodeDownload(下载二维码组件，前端生成二维码)
   > - 组件使用场景：后台返回url的情况下，前端根据url生成二维码并展示，同时提供根据不同尺寸大小下载的功能
   > - 参数：url(必填，string型，生成二维码的url)、isShow(bool型，显示下载弹窗，默认false，如果想显
       示下载二维码的弹窗需要置为true)、codeName(string型，下载二维码名称)
   > - 使用方法：<QrcodeDownload isShow={true} url="url" name='h5二维码'></QrcodeDownload>
   
 ## 16.DownLoadImg(下载二维码组件,后端生成二维码)
   > - 组件使用场景：后台返回二维码的情况下，前端直接展示二维码，同时提供根据不同尺寸大小下载的功能
   > - 参数：url(必填，string型，后端生成的二维码图片地址)、isShow(bool型，显示下载弹窗，默认false，如果想显
       示下载二维码的弹窗需要置为true)、codeName(string型，下载二维码名称)
   > - 使用方法：<DownLoadImg isShow={true} url="**.png" name='h5二维码' />
   
 ## 17.SendCode(发送短信验证码组件)
   > - 组件使用场景：需要发送验证码的地方，如登陆、忘记密码等
   > - 参数：name(必传，string型，文本框名称)、form(必传，object型，表单对象)、handleSend(必传，
       func型，处理发送事件 支持callback)、formSubmit(func型，点击回车表单提交)
   > - 使用方法：<SendCode name="phoneCode" form={form} handleSend={this.handleSend}/>
   
 ## 18.TableSearch(列表条件查询组件)
   > - 组件使用场景：列表的查询条件组件
   > - 参数：colNum(枚举，可选值2,3,4,6,8，默认4，一行展示几个查询条件)、search(func型，查询
       回调函数)、reset(func型，重置回调函数)
   > - 使用方法：<div><Form><TableSearch search={this.search} reset={this.reset} 
       colNum={4}><Form.Item>'文案说明'+'输入框'</Form.Item></TableSearch></Form></div>，
       ps：<Form.Item></Form.Item>为一个children，可传多个children，其中'文案说明'和'输入框'作
       为整体一个children传入
   
 ## 19.TableUser(表格组件)
   > - 组件使用场景：用表格来渲染数据,样式参考营销分析的的表格效果
   > - 参数：detailData(必传，object，具体类型定义titleText、numText、perText均为string型，
       dataItems为对象组成的数组，对象内部定义title-string型、num-string或number型，
       per-string或number型，如detailDataNew:{titleText:'活动拉新效果',numText:'人数',
       perText:'占比',dataItems:[{title:'拉新人数占比',num:0,per:'0%'},{title:'回头客
       人数占比',num:0,per:'0%'}]}
   > - 使用方法：<TableUser detailData={detailDataNew}></TableUser>
   
 ## 20.UploadAvatar(上传图片组件)
   > - 组件使用场景：用于上传图片
   > - 参数：headimgUrl(必传，string型，开始为空字符串，上传图片后把图片的url传入进行回显)、
       changeAvatar(必传，func型,用于设置图片回显)
   > - 使用方法： <UploadAvatar headimgUrl="" changeAvatar={this.changeAvatar} />
   
 ## 21.WhiteSpace(上下留白组件)
   > - 组件使用场景：用于元素上下之间间隔处理，ps:不可传children
   > - 参数：size(枚举，可选值'v-2xs', 'v-xs', 'v-sm', 'v-md', 'v-lg', 'v-sxl' , 
       'v-xl', 'v-2xl', 'v-3xl', 'v-4xl'，默认v-md)
   > - 使用方法：<WhiteSpace size="v-xl" />
   
 ## 22.WingBlank(左右留白组件)
   > - 组件使用场景：用于元素左右之间间隔处理,ps:可传children
   > - 参数：size(枚举，可选值'l-sm', 'l-md', 'l-lg', 'l-xl', 'l-2xl', 'l-3xl',
       'l-4xl', 'l-5xl'，默认l-md)
   > - 使用方法：<WingBlank size="l-2xl"><div>children</div></WingBlank> 
 