/* =========================================================
   ジャッチュ ことばの切り替え（日本語・English・繁體中文・简体中文・한국어）

   ■ ページの中の文字：HTML に data-i18n="キー" を書くと、そのキーの訳に置きかわる
     （data-i18n-html は太字などの入った訳。data-i18n-title はページのタイトル）
   ■ 訳を直したいとき：下の DICT の中の文字を書き換える
   ■ お店の名前やメニューの訳：お店の表（スプレッドシート）に「店名_en」のような列を足す
   ※ 翻訳は確認前の案です。ネイティブの人に確かめてもらってください。
   ========================================================= */
(function () {
  const LANGS = [
    ["ja", "日本語"], ["en", "English"], ["zh-Hant", "繁體中文"], ["zh-Hans", "简体中文"], ["ko", "한국어"],
  ];
  // 訳が無いときに次に見ることば
  const FALLBACK = { ja: [], en: ["ja"], "zh-Hant": ["zh-Hans", "ja"], "zh-Hans": ["zh-Hant", "ja"], ko: ["en", "ja"] };

  /* ---------------- 訳の一覧（ja / en / zh-Hant / zh-Hans / ko の順） ---------------- */
  const L = (ja, en, zt, zs, ko) => ({ ja, en, "zh-Hant": zt, "zh-Hans": zs, ko });
  const DICT = {
    // 共通
    "tab.home":   L("ホーム", "Home", "首頁", "首页", "홈"),
    "tab.board":  L("案内板", "Info", "資訊看板", "信息看板", "안내판"),
    "tab.ar":     L("AR", "AR", "AR", "AR", "AR"),
    "tab.gallery": L("みんな", "Gallery", "大家的", "大家的", "모두"),
    "tab.mine":    L("じぶんの電車", "My trams", "我的電車", "我的电车", "내 전차"),
    "tab.run":     L("走らせる", "Run", "奔跑", "奔跑", "달리기"),
    "tab.maker":  L("つくる", "Create", "製作", "制作", "만들기"),
    "car":        L("{name}号", "{name} Tram", "{name}號", "{name}号", "{name} 호"),
    "st.ok":      L("○ 空席", "○ Seats", "○ 有空位", "○ 有空位", "○ 자리 있음"),
    "st.few":     L("△ わずか", "△ Few left", "△ 剩少量", "△ 剩少量", "△ 조금 남음"),
    "st.full":    L("× 満席", "× Full", "× 客滿", "× 客满", "× 만석"),
    "min.soon":   L("まもなく", "Arriving", "即將到站", "即将到站", "곧 도착"),
    "min.left":   L("あと<b>{n}</b>分", "in <b>{n}</b> min", "還有<b>{n}</b>分", "还有<b>{n}</b>分", "<b>{n}</b>분 후"),
    "today":      L("本日限定：{m}", "Today only: {m}", "本日限定：{m}", "今日限定：{m}", "오늘 한정: {m}"),
    "safety":     L("⚠ 線路や車道には入らず、歩道や安全地帯から使ってください。",
                    "⚠ Never step onto the tracks or the road. Use it from the sidewalk or the tram stop.",
                    "⚠ 請勿進入軌道或車道，請在人行道或安全島上使用。",
                    "⚠ 请勿进入轨道或车道，请在人行道或安全岛上使用。",
                    "⚠ 선로나 차도에 들어가지 말고, 보도나 안전지대에서 사용하세요."),

    // トップ（index.html）
    "idx.title":   L("ジャッチュ | じぶんの電車をデザインして走らせよう", "Jatchu | Design your own tram and make it run", "Jatchu | 設計自己的電車讓它跑起來", "Jatchu | 设计自己的电车让它跑起来", "자추 | 나만의 전차를 디자인해서 달리게 하자"),
    "idx.brand":   L("ジャッチュ", "Jatchu", "Jatchu", "Jatchu", "자추"),
    "idx.tagline": L("大門町 × 函館市電　待ち時間に、お店の電車を走らせよう",
                     "Daimon × Hakodate Tram — run a local shop's tram while you wait",
                     "大門町 × 函館市電　等車時，讓店家的電車跑起來吧",
                     "大门町 × 函馆市电　等车时，让店家的电车跑起来吧",
                     "다이몬초 × 하코다테 시덴 — 기다리는 동안 가게 전차를 달리게 해 보세요"),
    "idx.ios":     L("📲 <b>ホーム画面に追加</b>すると、アプリのように使えます。<br>Safari の {icon}（共有）→「ホーム画面に追加」を押してください。",
                     "📲 <b>Add to Home Screen</b> to use it like an app.<br>In Safari, tap {icon} (Share) → “Add to Home Screen”.",
                     "📲 <b>加入主畫面</b>後，就能像 App 一樣使用。<br>請在 Safari 點 {icon}（分享）→「加入主畫面」。",
                     "📲 <b>添加到主屏幕</b>后，就能像 App 一样使用。<br>请在 Safari 点 {icon}（分享）→「添加到主屏幕」。",
                     "📲 <b>홈 화면에 추가</b>하면 앱처럼 쓸 수 있어요.<br>Safari에서 {icon}(공유) → ‘홈 화면에 추가’를 누르세요."),
    "idx.and":     L("📲 <b>ホーム画面に追加</b>すると、アプリのように使えます。", "📲 <b>Add to Home Screen</b> to use it like an app.",
                     "📲 <b>加入主畫面</b>後，就能像 App 一樣使用。", "📲 <b>添加到主屏幕</b>后，就能像 App 一样使用。", "📲 <b>홈 화면에 추가</b>하면 앱처럼 쓸 수 있어요."),
    "idx.addBtn":  L("ホーム画面に追加する", "Add to Home Screen", "加入主畫面", "添加到主屏幕", "홈 화면에 추가"),
    "idx.next":    L("{stop} 次の電車", "Next tram at {stop}", "{stop} 下一班電車", "{stop} 下一班电车", "{stop} 다음 전차"),
    "idx.open":    L("いま入れるお店", "Shops with seats now", "現在有空位的店", "现在有空位的店", "지금 들어갈 수 있는 가게"),
    "idx.count":   L("<b>{n}</b>軒", "<b>{n}</b> shops", "<b>{n}</b>家", "<b>{n}</b>家", "<b>{n}</b>곳"),
    "idx.more":    L("案内板を見る ›", "Open the info board ›", "查看資訊看板 ›", "查看信息看板 ›", "안내판 보기 ›"),
    "idx.play":    L("あそぶ", "Play", "玩玩看", "玩一玩", "즐기기"),
    "idx.find":    L("しらべる", "Info", "查詢", "查询", "알아보기"),
    "idx.mini.t":  L("お店の電車をARで走らせる", "Run a shop's tram in AR", "用AR讓店家的電車跑起來", "用AR让店家的电车跑起来", "가게 전차를 AR로 달리게 하기"),
    "idx.mini.d":  L("机や床の上を、大門町のお店のラッピング電車が走ります", "A tram wrapped in a Daimon shop's design runs on your table or floor",
                     "大門町店家彩繪電車，會在桌上或地板上奔跑", "大门町店家彩绘电车，会在桌上或地板上奔跑", "다이몬초 가게 디자인의 래핑 전차가 책상이나 바닥 위를 달려요"),
    "idx.rail.t":  L("本物の線路で", "On real tracks", "在真正的軌道上", "在真正的轨道上", "진짜 선로에서"),
    "idx.rail.d":  L("函館市電の線路にカメラを向けると電車が走る", "Point your camera at the Hakodate tram tracks", "把相機對準函館市電的軌道", "把相机对准函馆市电的轨道", "하코다테 시덴 선로에 카메라를 비추면 전차가 달려요"),
    "idx.beta":    L("試作", "Beta", "試作版", "试作版", "시범"),
    "idx.track.t": L("段ボールの線路", "Cardboard track", "紙箱軌道", "纸箱轨道", "골판지 선로"),
    "idx.track.d": L("紙や段ボールの線路の上を走る", "Runs on a paper or cardboard track", "在紙或紙箱做的軌道上跑", "在纸或纸箱做的轨道上跑", "종이나 골판지 선로 위를 달려요"),
    "idx.maker.t": L("電車をつくる", "Design a tram", "製作電車", "制作电车", "전차 만들기"),
    "idx.maker.d": L("色・模様・文字・写真で、じぶんの電車に", "Colors, patterns, text and photos — make it yours", "用顏色・圖案・文字・照片做出自己的電車", "用颜色・图案・文字・照片做出自己的电车", "색・무늬・글자・사진으로 나만의 전차를"),
    "idx.life.t":  L("実物大の電車", "Life-size tram", "實物大小的電車", "实物大小的电车", "실물 크기 전차"),
    "idx.life.d":  L("全長13mの500形を目の前に出す", "Place the 13 m Type 500 tram right in front of you", "把全長13公尺的500型放在眼前", "把全长13米的500型放在眼前", "길이 13m의 500형을 눈앞에"),
    "idx.board.t": L("時刻表・案内板", "Timetable & info", "時刻表・資訊看板", "时刻表・信息看板", "시각표・안내판"),
    "idx.board.d": L("電車の時刻・空席・限定メニュー・イベント", "Tram times, open seats, specials and events", "電車時刻・空位・限定菜單・活動", "电车时刻・空位・限定菜单・活动", "전차 시각・빈자리・한정 메뉴・이벤트"),
    "idx.sample":  L("※ 時刻・お店・イベントの一部はサンプルです。", "* Some times, shops and events are samples.", "※ 部分時刻・店家・活動為範例。", "※ 部分时刻・店家・活动为示例。", "※ 시각・가게・이벤트의 일부는 샘플입니다."),
    "idx.see":     L("👀 みんなの電車を見る", "👀 See everyone's trams", "👀 看大家的電車", "👀 看大家的电车", "👀 모두의 전차 보기"),

    "idx.rail2":   L("🛤 本物の線路で走らせる", "🛤 Run on real tracks", "🛤 在真正的軌道上跑", "🛤 在真正的轨道上跑", "🛤 진짜 선로에서 달리기"),
    "idx.mine":    L("🚃 じぶんの電車", "🚃 My trams", "🚃 我的電車", "🚃 我的电车", "🚃 내 전차"),
    "idx.s2b":     L("3D・ARで見る", "See it in 3D & AR", "用3D・AR觀看", "用3D・AR观看", "3D・AR로 보기"),
    "idx.s3b":     L("本物の線路で走らせる", "Run it on real tracks", "在真正的軌道上跑", "在真正的轨道上跑", "진짜 선로에서 달리기"),
    "idx.demo":    L("🧪 デモ版（以前の試作）を見る", "🧪 See the demo (earlier prototype)", "🧪 查看示範版（之前的試作）", "🧪 查看演示版（之前的试作）", "🧪 데모판(이전 시제품) 보기"),

    // はじめての人向けの案内（index.html）
    "ob.help":     L("使い方", "How it works", "使用方法", "使用方法", "사용 방법"),
    "ob.skip":     L("スキップ", "Skip", "略過", "跳过", "건너뛰기"),
    "ob.next":     L("つぎへ", "Next", "下一步", "下一步", "다음"),
    "ob.start":    L("🎨 さっそくつくる", "🎨 Start designing", "🎨 馬上開始製作", "🎨 马上开始制作", "🎨 바로 만들기"),
    "ob.home":     L("ホームを見る", "Go to Home", "看首頁", "看首页", "홈 보기"),
    "ob.t1":       L("電車をデザインする", "Design a tram", "設計電車", "设计电车", "전차 디자인하기"),
    "ob.d1":       L("まっさらな白い電車に、色・もよう・文字・写真・おえかき・ステッカーで、世界に1台だけの電車をつくろう。",
                     "Start from a plain white tram and add colors, patterns, text, photos, drawings and stickers to make a one-of-a-kind tram.",
                     "從一台全白的電車開始，用顏色・圖案・文字・照片・塗鴉・貼紙，做出世界上唯一的電車。",
                     "从一台全白的电车开始，用颜色・图案・文字・照片・涂鸦・贴纸，做出世界上唯一的电车。",
                     "새하얀 전차에 색・무늬・글자・사진・그림・스티커로 세상에 하나뿐인 전차를 만들어 보세요."),
    "ob.t2":       L("3D・ARで見る", "See it in 3D & AR", "用3D・AR觀看", "用3D・AR观看", "3D・AR로 보기"),
    "ob.d2":       L("つくった電車は3Dでくるっと回して見られます。「ARで走らせる」を押すと、机や床の上を走ります。",
                     "Spin your tram around in 3D. Tap “Run it in AR” and it runs on your table or floor.",
                     "做好的電車可以用3D轉來轉去看。按「用AR讓它跑」，它就會在桌上或地板上奔跑。",
                     "做好的电车可以用3D转来转去看。按「用AR让它跑」，它就会在桌上或地板上奔跑。",
                     "만든 전차를 3D로 빙글빙글 돌려 볼 수 있어요. ‘AR로 달리기’를 누르면 책상이나 바닥 위를 달려요."),
    "ob.t3":       L("本物の線路で走らせる", "Run it on real tracks", "在真正的軌道上跑", "在真正的轨道上跑", "진짜 선로에서 달리기"),
    "ob.d3":       L("函館市電の線路にカメラを向けると、じぶんの電車が走ってきます。画面をなぞると動かせます。",
                     "Point your camera at the Hakodate tram tracks and your tram comes running. Swipe the screen to move it.",
                     "把相機對準函館市電的軌道，你的電車就會跑過來。滑動畫面可以移動它。",
                     "把相机对准函馆市电的轨道，你的电车就会跑过来。滑动画面可以移动它。",
                     "하코다테 시덴 선로에 카메라를 비추면 내 전차가 달려와요. 화면을 문지르면 움직일 수 있어요."),
    "ob.safe":     L("⚠ 線路や車道には絶対に入らず、歩道や安全地帯から使ってください。",
                     "⚠ Never step onto the tracks or the road. Use it from the sidewalk or the tram stop.",
                     "⚠ 絕對不要進入軌道或車道，請在人行道或安全島上使用。",
                     "⚠ 绝对不要进入轨道或车道，请在人行道或安全岛上使用。",
                     "⚠ 선로나 차도에는 절대 들어가지 말고, 보도나 안전지대에서 사용하세요."),

    // じぶんの電車（mine.html）
    "my.title":    L("🚃 じぶんの電車", "🚃 My trams", "🚃 我的電車", "🚃 我的电车", "🚃 내 전차"),
    "my.sub":      L("作った電車が流れてきます。スワイプで速さを変えられます。電車をタップすると、なおしたり線路で走らせたりできます。",
                     "Your trams roll by. Swipe to change the speed. Tap a tram to edit it or run it on real tracks.",
                     "你做的電車會一台台跑過來。滑動可以改變速度，點電車就能修改或在軌道上奔跑。",
                     "你做的电车会一台台跑过来。滑动可以改变速度，点电车就能修改或在轨道上奔跑。",
                     "내가 만든 전차가 달려와요. 스와이프로 속도를 바꿀 수 있어요. 전차를 탭하면 고치거나 선로에서 달리게 할 수 있어요."),
    "my.empty":    L("まだ電車がありません。今はお手本の電車が走っています。「つくる」で、じぶんの電車をつくってみよう！",
                     "No trams yet — sample trams are running for now. Make your own in “Create”!",
                     "還沒有電車。現在跑的是範例電車。到「製作」做出你自己的電車吧！",
                     "还没有电车。现在跑的是示例电车。到「制作」做出你自己的电车吧！",
                     "아직 전차가 없어요. 지금은 견본 전차가 달리고 있어요. ‘만들기’에서 나만의 전차를 만들어 보세요!"),
    "my.make":     L("＋ 新しい電車をつくる", "+ Make a new tram", "＋ 做一台新電車", "＋ 做一台新电车", "+ 새 전차 만들기"),
    "my.list":     L("保存した電車（{n}台）", "Saved trams ({n})", "已儲存的電車（{n}台）", "已保存的电车（{n}台）", "저장한 전차 ({n}대)"),
    "my.none":     L("まだありません", "None yet", "還沒有", "还没有", "아직 없어요"),
    "my.when":     L("{d} に保存", "Saved {d}", "{d} 儲存", "{d} 保存", "{d} 저장"),
    "my.sample":   L("お手本の電車", "Sample tram", "範例電車", "示例电车", "견본 전차"),
    "my.run":      L("🛤 本物の線路で走らせる", "🛤 Run on real tracks", "🛤 在真正的軌道上跑", "🛤 在真正的轨道上跑", "🛤 진짜 선로에서 달리기"),
    "my.edit":     L("✏️ なおす・3DとARで見る", "✏️ Edit · see in 3D & AR", "✏️ 修改・用3D和AR看", "✏️ 修改・用3D和AR看", "✏️ 고치기・3D와 AR로 보기"),
    "my.del":      L("🗑 この電車をけす", "🗑 Delete this tram", "🗑 刪除這台電車", "🗑 删除这台电车", "🗑 이 전차 지우기"),
    "my.delq":     L("「{name}」をけしますか？（もとにもどせません）", "Delete “{name}”? (This can't be undone)", "要刪除「{name}」嗎？（無法復原）", "要删除「{name}」吗？（无法恢复）", "‘{name}’을(를) 지울까요? (되돌릴 수 없어요)"),
    "my.note":     L("※ 作った電車は、このスマホの中だけに保存されます（ほかの人には見えません）。ブラウザの履歴やWebサイトのデータを消すと、いっしょに消えます。",
                     "* Your trams are saved only on this phone (no one else can see them). Clearing your browser's history or website data deletes them too.",
                     "※ 你做的電車只會存在這支手機裡（其他人看不到）。清除瀏覽器的紀錄或網站資料時也會一起刪除。",
                     "※ 你做的电车只会保存在这部手机里（其他人看不到）。清除浏览器的记录或网站数据时也会一起删除。",
                     "※ 만든 전차는 이 스마트폰에만 저장돼요(다른 사람은 볼 수 없어요). 브라우저 기록이나 웹사이트 데이터를 지우면 함께 지워져요."),

    // みんなの電車（gallery.html）
    "gl.title":    L("👀 みんなの電車", "👀 Everyone's trams", "👀 大家的電車", "👀 大家的电车", "👀 모두의 전차"),
    "gl.sub":      L("左右にスワイプして速さを変えよう。電車をタップすると、いいね・コメントできます。",
                     "Swipe left or right to change the speed. Tap a tram to like it or leave a comment.",
                     "左右滑動來改變速度。點一下電車就能按讚・留言。",
                     "左右滑动来改变速度。点一下电车就能点赞・留言。",
                     "좌우로 스와이프해서 속도를 바꿔 보세요. 전차를 탭하면 좋아요・댓글을 남길 수 있어요."),
    "gl.hint":     L("👆 スワイプ！", "👆 Swipe!", "👆 滑動！", "👆 滑动！", "👆 스와이프!"),
    "gl.speed":    L("はやさ", "Speed", "速度", "速度", "속도"),
    "gl.make":     L("🎨 じぶんの電車をつくって出す", "🎨 Design yours and add it", "🎨 製作自己的電車並加入", "🎨 制作自己的电车并加入", "🎨 나만의 전차를 만들어 올리기"),
    "gl.rank":     L("いいねが多い電車ほど、よく走ってきます", "The more likes a tram has, the more often it comes by", "讚越多的電車，越常跑過來", "赞越多的电车，越常跑过来", "좋아요가 많은 전차일수록 자주 달려와요"),
    "gl.chance":   L("出やすさ {p}%", "Chance {p}%", "出現率 {p}%", "出现率 {p}%", "출현율 {p}%"),
    "gl.by.sample": L("サンプル", "Sample", "範例", "示例", "샘플"),
    "gl.by.me":    L("あなたの電車", "Your tram", "你的電車", "你的电车", "내 전차"),
    "gl.like":     L("いいね", "Like", "讚", "赞", "좋아요"),
    "gl.comments": L("コメント", "Comments", "留言", "留言", "댓글"),
    "gl.ph":       L("ひとことコメント（40文字まで）", "Short comment (up to 40 characters)", "簡短留言（40字以內）", "简短留言（40字以内）", "한마디 댓글 (40자까지)"),
    "gl.send":     L("送る", "Send", "送出", "发送", "보내기"),
    "gl.ng":       L("その言葉は使えません", "That word can't be used", "不能使用這個詞", "不能使用这个词", "그 말은 쓸 수 없어요"),
    "gl.none":     L("まだコメントはありません", "No comments yet", "還沒有留言", "还没有留言", "아직 댓글이 없어요"),
    "gl.close":    L("閉じる", "Close", "關閉", "关闭", "닫기"),
    "gl.mine.new": L("🎉 あなたの電車が走ってきます！", "🎉 Here comes your tram!", "🎉 你的電車來了！", "🎉 你的电车来了！", "🎉 내 전차가 달려와요!"),
    "gl.note":     L("※ 試作版です。いいね・コメントは、この端末の中だけに保存されます（ほかの人には見えません）。サンプルの電車のいいね数・コメントは例です。",
                     "* Prototype: likes and comments are saved only on this device (other people can't see them). The likes and comments on sample trams are examples.",
                     "※ 試作版。按讚・留言只會存在這台裝置裡（其他人看不到）。範例電車的讚數・留言只是例子。",
                     "※ 试作版。点赞・留言只会保存在这台设备里（其他人看不到）。示例电车的赞数・留言只是例子。",
                     "※ 시범 버전입니다. 좋아요・댓글은 이 기기에만 저장돼요(다른 사람에게는 보이지 않아요). 샘플 전차의 좋아요 수・댓글은 예시입니다."),
    "idx.qr":      L("🖨 QRコードの貼り紙をつくる（運営用）", "🖨 Print QR posters (for staff)", "🖨 製作QR海報（工作人員用）", "🖨 制作QR海报（工作人员用）", "🖨 QR 포스터 만들기 (운영자용)"),
    "idx.h1":      L("じぶんの電車を<br><em>デザイン</em>して、走らせよう", "<em>Design</em> your own tram,<br>then make it run", "<em>設計</em>你自己的電車，<br>讓它跑起來", "<em>设计</em>你自己的电车，<br>让它跑起来", "나만의 전차를 <em>디자인</em>하고<br>달리게 하자"),
    "idx.lead":    L("色・もよう・おえかき・ステッカーで、世界に1台だけの電車を。できたらARで、机の上や函館の線路に走らせよう。",
                     "Colors, patterns, drawings and stickers — make a one-of-a-kind tram. Then run it in AR on your table or on Hakodate's tram tracks.",
                     "用顏色・圖案・塗鴉・貼紙，做出世界上唯一的電車。完成後用AR讓它在桌上或函館的軌道上奔跑。",
                     "用颜色・图案・涂鸦・贴纸，做出世界上唯一的电车。完成后用AR让它在桌上或函馆的轨道上奔跑。",
                     "색・무늬・그림・스티커로 세상에 하나뿐인 전차를 만들어요. 완성하면 AR로 책상 위나 하코다테 선로 위를 달리게 해 보세요."),
    "idx.cta":     L("🎨 電車をつくる", "🎨 Design a tram", "🎨 製作電車", "🎨 制作电车", "🎨 전차 만들기"),
    "idx.s1":      L("デザインする", "Design", "設計", "设计", "디자인"),
    "idx.s2":      L("ARで走らせる", "Run it in AR", "用AR奔跑", "用AR奔跑", "AR로 달리기"),
    "idx.s3":      L("みんなに見せる", "Show everyone", "分享給大家", "分享给大家", "모두에게 보여주기"),
    "idx.soon":    L("準備中", "Coming soon", "準備中", "准备中", "준비 중"),
    "idx.others":  L("ほかのあそびかた", "More ways to play", "其他玩法", "其他玩法", "다른 놀이"),

    // 案内板（board.html）
    "bd.title":    L("大門町 案内板", "Daimon Info Board", "大門町 資訊看板", "大门町 信息看板", "다이몬초 안내판"),
    "bd.sub":      L("ジャッチュ ／ 函館駅前・松風町", "Jatchu / Hakodate-ekimae · Matsukaze-cho", "Jatchu ／ 函館站前・松風町", "Jatchu ／ 函馆站前・松风町", "자추 / 하코다테에키마에・마츠카제초"),
    "bd.platform": L("市電 {stop} のりば", "Tram stop: {stop}", "市電 {stop} 乘車處", "市电 {stop} 乘车处", "시덴 {stop} 승강장"),
    "bd.updated":  L("{t} 更新", "Updated {t}", "{t} 更新", "{t} 更新", "{t} 갱신"),
    "bd.first":    L("先発", "Next", "下一班", "下一班", "이번"),
    "bd.then":     L("次発", "Then", "再下一班", "再下一班", "다음"),
    "bd.route":    L("{n}系統", "Route {n}", "{n}號系統", "{n}号系统", "{n}계통"),
    "bd.for":      L("{d} 行", "to {d}", "往 {d}", "往 {d}", "{d} 행"),
    "bd.approach": L("▼ 次の電車の位置（{d}方面）", "▼ Where the next tram is (to {d})", "▼ 下一班電車的位置（往{d}）", "▼ 下一班电车的位置（往{d}）", "▼ 다음 전차 위치 ({d} 방면)"),
    "bd.wait":     L("📷 待ち時間にAR：「{car}」を走らせる", "📷 While you wait: run the {car} in AR", "📷 等車時用AR讓「{car}」跑起來", "📷 等车时用AR让「{car}」跑起来", "📷 기다리는 동안 AR로 「{car}」 달리기"),
    "bd.src.sample": L("サンプル", "Sample", "範例", "示例", "샘플"),
    "bd.src.cache":  L("前回の情報", "Last saved", "上次的資料", "上次的数据", "이전 정보"),
    "bd.maker":    L("🎨 じぶんの電車をつくって走らせる", "🎨 Design your own tram and run it", "🎨 設計自己的電車並讓它跑", "🎨 设计自己的电车并让它跑", "🎨 나만의 전차를 만들어 달리게 하기"),
    "bd.menus":    L("本日の限定メニュー", "Today's specials", "本日限定菜單", "今日限定菜单", "오늘의 한정 메뉴"),
    "bd.extra":    L("ジャッチュ提示で 1杯目 50円引き（例）", "Show Jatchu: ¥50 off your first drink (example)", "出示 Jatchu：第一杯折50日圓（範例）", "出示 Jatchu：第一杯减50日元（示例）", "자추 화면 제시 시 첫 잔 50엔 할인 (예시)"),
    "bd.events":   L("今日のイベント", "Today's events", "今日活動", "今日活动", "오늘의 이벤트"),
    "bd.footer":   L("※ 表示している時刻・店舗・イベントはすべてサンプルです。<br>実際のサービスでは、市電の運行情報とお店の管理画面につないで自動で更新します。",
                     "* All times, shops and events shown are samples.<br>The real service will update automatically from tram and shop data.",
                     "※ 顯示的時刻・店家・活動皆為範例。<br>正式服務會連接市電運行資訊與店家後台自動更新。",
                     "※ 显示的时刻・店家・活动均为示例。<br>正式服务会连接市电运行信息与店家后台自动更新。",
                     "※ 표시된 시각・가게・이벤트는 모두 샘플입니다.<br>실제 서비스에서는 시덴 운행 정보와 가게 관리 화면에 연결해 자동으로 갱신됩니다."),

    // お店の電車 AR（mini.html）
    "mn.title":    L("ジャッチュ お店の電車 AR", "Jatchu | Shop Trams AR", "Jatchu 店家電車 AR", "Jatchu 店家电车 AR", "자추 가게 전차 AR"),
    "mn.pick":     L("🚋 お店の電車をえらぶ", "🚋 Choose a shop's tram", "🚋 選擇店家的電車", "🚋 选择店家的电车", "🚋 가게 전차 고르기"),
    "mn.hint":     L("指でなぞると回せます・2本指で拡大", "Drag to rotate · pinch to zoom", "用手指拖曳旋轉・雙指放大", "用手指拖动旋转・双指放大", "손가락으로 돌리기 · 두 손가락으로 확대"),
    "mn.ar":       L("📷 ARで走らせる", "📷 Run it in AR", "📷 用AR讓它跑", "📷 用AR让它跑", "📷 AR로 달리기"),
    "mn.track":    L("段ボールの線路", "Cardboard track", "紙箱軌道", "纸箱轨道", "골판지 선로"),
    "mn.rail":     L("本物の線路", "Real tracks", "真正的軌道", "真正的轨道", "진짜 선로"),
  };

  // 電停・行き先の名前（日本語の名前 → 訳）
  const NAMES = {
    "函館駅前": L("函館駅前", "Hakodate-ekimae", "函館站前", "函馆站前", "하코다테에키마에"),
    "松風町":   L("松風町", "Matsukaze-cho", "松風町", "松风町", "마츠카제초"),
    "十字街":   L("十字街", "Jujigai", "十字街", "十字街", "주지가이"),
    "魚市場通": L("魚市場通", "Uoichiba-dori", "魚市場通", "鱼市场通", "우오이치바도리"),
    "市役所前": L("市役所前", "Shiyakusho-mae", "市政府前", "市政府前", "시야쿠쇼마에"),
    "谷地頭":   L("谷地頭", "Yachigashira", "谷地頭", "谷地头", "야치가시라"),
    "湯の川":   L("湯の川", "Yunokawa", "湯之川", "汤之川", "유노카와"),
    "函館どつく前": L("函館どつく前", "Hakodate-dokku-mae", "函館船塢前", "函馆船坞前", "하코다테돗쿠마에"),
  };

  /* ---------------- しくみ（ふだんは触らなくてOK） ---------------- */
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const codes = LANGS.map((x) => x[0]);
  function guess() {
    for (const raw of navigator.languages || [navigator.language || "ja"]) {
      const l = String(raw).toLowerCase();
      if (l.startsWith("ja")) return "ja";
      if (l.startsWith("ko")) return "ko";
      if (l.startsWith("zh")) return /hant|tw|hk|mo/.test(l) ? "zh-Hant" : "zh-Hans";
      if (l.startsWith("en")) return "en";
    }
    return "en";
  }
  const q = new URLSearchParams(location.search).get("lang");
  let lang = codes.includes(q) ? q : codes.includes(store.get("jatchu_lang")) ? store.get("jatchu_lang") : guess();
  if (codes.includes(q)) store.set("jatchu_lang", q);

  // 訳を選ぶ（{ja:…, en:…} のような入れ物から、今のことば → 予備のことば → 日本語 の順）
  function pick(obj) {
    if (obj == null || typeof obj !== "object") return obj;
    for (const l of [lang, ...FALLBACK[lang], "ja"]) if (obj[l] != null && obj[l] !== "") return obj[l];
    return "";
  }
  function t(key, vars) {
    let s = DICT[key] ? pick(DICT[key]) : key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }
  const name = (ja) => (NAMES[ja] ? pick(NAMES[ja]) : ja);
  // お店の項目（name / genre / menu / catch）の訳。表に訳が無ければ日本語のまま
  function shop(s, field) {
    if (!s) return "";
    const tr = s.i18n || {};
    for (const l of [lang, ...FALLBACK[lang]]) if (l !== "ja" && tr[l] && tr[l][field]) return tr[l][field];
    return s[field] || "";
  }
  const status = (st) => t("st." + (st || "ok"));

  // 下のタブ（中が空の <nav class="jt-tabs"></nav> に、本番のタブを入れる）
  const TABS = [["index.html", "🏠", "tab.home"], ["maker.html", "🎨", "tab.maker"], ["mine.html", "🚃", "tab.mine"], ["rail.html", "🛤", "tab.run"]];
  function tabs() {
    const here = location.pathname.replace(/.*\//, "") || "index.html";
    document.querySelectorAll("nav.jt-tabs").forEach((nav) => {
      if (nav.children.length) return;
      nav.innerHTML = TABS.map(([h, i, k]) => `<a href="${h}"${h === here ? ' class="on"' : ""}><span>${i}</span><small data-i18n="${k}"></small></a>`).join("");
    });
  }
  // data-i18n のついた所を、今のことばに書き換える
  function apply(root = document) {
    tabs();
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    const tt = document.querySelector("[data-i18n-title]");
    if (tt) document.title = t(tt.dataset.i18nTitle);
    document.documentElement.lang = lang;
    document.querySelectorAll("select.jl-sel").forEach((sel) => { sel.value = lang; });
  }
  function set(l) {
    if (!codes.includes(l) || l === lang) return;
    lang = l; store.set("jatchu_lang", l);
    apply();
    document.dispatchEvent(new CustomEvent("jatchu-lang", { detail: l }));
    if (window.jatchuCount) window.jatchuCount("ことば → " + l);   // 外国語に切り替えた数
  }
  // 🌐 ことばを選ぶボタン（el の中に入れる）
  function switcher(el) {
    if (!el) return;
    el.innerHTML = `<label class="jl-wrap" aria-label="Language"><span class="jl-ic">🌐</span><select class="jl-sel">` +
      LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join("") + `</select></label>`;
    const sel = el.querySelector("select"); sel.value = lang;
    sel.addEventListener("change", () => set(sel.value));
  }
  // ボタンの見た目（どのページでも同じ）
  const css = document.createElement("style");
  css.textContent = `.jl-wrap{display:inline-flex;align-items:center;gap:4px;min-height:36px;padding:0 4px 0 10px;border:1px solid #3a3a3d;
    border-radius:18px;background:#141417;color:#f4f1e8;font:13px -apple-system,"Hiragino Sans",sans-serif;cursor:pointer}
    .jl-ic{font-size:15px}.jl-sel{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:inherit;font:inherit;
    padding:6px 8px 6px 0;cursor:pointer;outline:none}.jl-sel option{color:#111}`;
  document.head.appendChild(css);

  window.JL = { get lang() { return lang; }, LANGS, t, pick, name, shop, status, apply, set, switcher };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => apply());
  else apply();
})();
