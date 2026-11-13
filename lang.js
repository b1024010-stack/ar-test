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
    "tab.mine":    L("自分の電車", "My trams", "我的電車", "我的电车", "내 전차"),
    "pv.title":    L("🛡 安全とプライバシー", "🛡 Safety & Privacy", "🛡 安全與隱私", "🛡 安全与隐私", "🛡 안전과 개인정보"),
    "pv.link":     L("安全とプライバシー", "Safety & Privacy", "安全與隱私", "安全与隐私", "안전과 개인정보"),
    "tm.title":    L("📜 利用規約", "📜 Terms of Use", "📜 使用條款", "📜 使用条款", "📜 이용약관"),
    "tm.link":     L("利用規約", "Terms of Use", "使用條款", "使用条款", "이용약관"),
    // ---- 作る・走らせる（ここから） ----
    "mk.title": L("電車を作る | ジャッチュ", "Create a tram | Jatchu", "製作電車 | Jatchu", "制作电车 | Jatchu", "전차 만들기 | Jatchu"),
    "mk.badge": L("🎨 電車を作る", "🎨 Create a tram", "🎨 製作電車", "🎨 制作电车", "🎨 전차 만들기"),
    "mk.ar": L("📷 ARで走らせる", "📷 Run it in AR", "📷 用AR行駛", "📷 用AR行驶", "📷 AR로 달리기"),
    "mk.start": L("白い電車から、自由にデザインしよう", "Start from a white tram and design freely", "從白色電車開始，自由設計吧", "从白色电车开始，自由设计吧", "하얀 전차로 자유롭게 디자인해 보자"),
    "mk.auto": L("自動で保存されます", "Saved automatically.", "會自動儲存。", "会自动保存。", "자동으로 저장됩니다."),
    "mk.new": L("＋ 新しく作る", "+ New tram", "＋ 新建", "＋ 新建", "＋ 새로 만들기"),
    "mk.reset": L("🔄 白い電車にもどす", "🔄 Back to a white tram", "🔄 恢復成白色電車", "🔄 恢复成白色电车", "🔄 하얀 전차로 되돌리기"),
    "mk.h1": L("① 色", "① Colors", "① 顏色", "① 颜色", "① 색"),
    "mk.h1s": L("車体の色と、模様・帯の色", "Body color and pattern color", "車身與花紋的顏色", "车身与花纹的颜色", "차체 색과 무늬 색"),
    "mk.body": L("車体", "Body", "車身", "车身", "차체"),
    "mk.patc": L("模様", "Pattern", "花紋", "花纹", "무늬"),
    "mk.h2": L("② 模様", "② Pattern", "② 花紋", "② 花纹", "② 무늬"),
    "mk.h3": L("③ 文字", "③ Text", "③ 文字", "③ 文字", "③ 글자"),
    "mk.h3s": L("電車の名前やメッセージ", "Your tram's name or a message", "電車名稱或留言", "电车名称或留言", "전차 이름이나 메시지"),
    "mk.ph": L("例：いちご号（なくてもOK）", "e.g. Strawberry (optional)", "例：草莓號（可不填）", "例：草莓号（可不填）", "예: 딸기호 (없어도 OK)"),
    "mk.tcol": L("文字の色", "Text color", "文字顏色", "文字颜色", "글자 색"),
    "mk.h4": L("④ 写真", "④ Photos", "④ 照片", "④ 照片", "④ 사진"),
    "mk.h4s": L("ステッカーみたいに、好きな所に貼れるよ", "Stick them anywhere, like stickers", "像貼紙一樣貼在喜歡的地方吧", "像贴纸一样贴在喜欢的地方吧", "스티커처럼 원하는 곳에 붙여 보자"),
    "mk.photo": L("📷 写真をえらぶ", "📷 Choose a photo", "📷 選擇照片", "📷 选择照片", "📷 사진 고르기"),
    "mk.rmphoto": L("前の写真を外す", "Remove old photo", "移除舊照片", "移除旧照片", "예전 사진 빼기"),
    "mk.photonote": L("写真は端末の中だけで使い、送信しません。", "Photos stay on this device and are never sent.", "照片只在此裝置中使用，不會傳送。", "照片只在此设备中使用，不会发送。", "사진은 이 기기 안에서만 사용하며 전송하지 않습니다."),
    "mk.h5": L("⑤ 絵・ステッカー", "⑤ Drawings & stickers", "⑤ 繪圖・貼紙", "⑤ 绘图・贴纸", "⑤ 그림・스티커"),
    "mk.h5s": L("指で絵をかいたり、ステッカーを貼ったりしよう", "Draw with your finger or add stickers", "用手指畫畫、貼貼紙吧", "用手指画画、贴贴纸吧", "손가락으로 그리거나 스티커를 붙여 보자"),
    "mk.pen": L("✏️ ペン", "✏️ Pen", "✏️ 畫筆", "✏️ 画笔", "✏️ 펜"),
    "mk.eraser": L("🧽 消しゴム", "🧽 Eraser", "🧽 橡皮擦", "🧽 橡皮擦", "🧽 지우개"),
    "mk.sticker": L("⭐ ステッカー", "⭐ Stickers", "⭐ 貼紙", "⭐ 贴纸", "⭐ 스티커"),
    "mk.left": L("◀ 左半分", "◀ Left half", "◀ 左半邊", "◀ 左半边", "◀ 왼쪽 절반"),
    "mk.right": L("右半分 ▶", "Right half ▶", "右半邊 ▶", "右半边 ▶", "오른쪽 절반 ▶"),
    "mk.all": L("全体", "Whole", "全部", "全部", "전체"),
    "mk.side": L("車体の横（両側に同じ絵が入るよ）", "Side of the tram (same on both sides)", "車身側面（兩側是同一張圖喔）", "车身侧面（两侧是同一张图哦）", "차체 옆면 (양쪽에 같은 그림이 들어가)"),
    "mk.width": L("太さ", "Width", "粗細", "粗细", "굵기"),
    "mk.ewidth": L("消す太さ", "Eraser size", "擦除粗細", "擦除粗细", "지우개 굵기"),
    "mk.stkhint": L("押して貼って、2本指で大きさと向きを変えられるよ。", "Tap to stick. Use two fingers to resize and rotate.", "點一下就能貼上，用兩根手指改變大小和方向喔。", "点一下就能贴上，用两根手指改变大小和方向哦。", "눌러서 붙이고, 두 손가락으로 크기와 방향을 바꿀 수 있어."),
    "mk.size": L("大きさ", "Size", "大小", "大小", "크기"),
    "mk.rot": L("向き", "Angle", "方向", "方向", "방향"),
    "mk.front": L("⬆ 前に出す", "⬆ To front", "⬆ 移到最前", "⬆ 移到最前", "⬆ 앞으로"),
    "mk.copy": L("⧉ もう1つ", "⧉ Duplicate", "⧉ 再一個", "⧉ 再一个", "⧉ 하나 더"),
    "mk.peel": L("🗑 はがす", "🗑 Remove", "🗑 撕下", "🗑 撕下", "🗑 떼기"),
    "mk.undo": L("↩ ひとつもどす", "↩ Undo", "↩ 復原", "↩ 撤销", "↩ 되돌리기"),
    "mk.clear": L("🗑 絵とステッカーを全部消す", "🗑 Clear all drawings & stickers", "🗑 清除全部繪圖與貼紙", "🗑 清除全部绘图与贴纸", "🗑 그림과 스티커 모두 지우기"),
    "mk.done": L("完成したら「📷 ARで走らせる」で、机の上を走らせてみよう！", "When you're done, tap “📷 Run it in AR” to run it on your table!", "完成後按「📷 用AR行駛」，讓它在桌上跑跑看吧！", "完成后按「📷 用AR行驶」，让它在桌上跑跑看吧！", "다 만들면 「📷 AR로 달리기」로 책상 위를 달리게 해 보자!"),
    "mk.goMine": L("🚃 自分の電車", "🚃 My trams", "🚃 我的電車", "🚃 我的电车", "🚃 내 전차"),
    "mk.goRail": L("🛤 線路で走らせる", "🛤 Run on the tracks", "🛤 在軌道上行駛", "🛤 在轨道上行驶", "🛤 선로에서 달리기"),
    "自分の電車": L("自分の電車", "My tram", "我的電車", "我的电车", "내 전차"),
    "✓ 保存しました（{t}）": L("✓ 保存しました（{t}）", "✓ Saved ({t})", "✓ 已儲存（{t}）", "✓ 已保存（{t}）", "✓ 저장했습니다 ({t})"),
    "⚠ 保存できませんでした（プライベートブラウズでは保存できません）": L("⚠ 保存できませんでした（プライベートブラウズでは保存できません）", "⚠ Couldn't save (saving doesn't work in private browsing).", "⚠ 無法儲存（無痕模式下無法儲存）。", "⚠ 无法保存（无痕模式下无法保存）。", "⚠ 저장하지 못했습니다 (비공개 브라우징에서는 저장할 수 없습니다)."),
    "「{name}」の続きから作ろう": L("「{name}」の続きから作ろう", "Keep working on “{name}”", "接著做「{name}」吧", "接着做「{name}」吧", "「{name}」 이어서 만들자"),
    "⚠ 広告のような言葉（{why}）は使えません": L("⚠ 広告のような言葉（{why}）は使えません", "⚠ Advertising-like words ({why}) can't be used.", "⚠ 不能使用像廣告的文字（{why}）。", "⚠ 不能使用像广告的文字（{why}）。", "⚠ 광고 같은 말({why})은 사용할 수 없습니다."),
    "URL・メールアドレス・SNSのアカウント": L("URL・メールアドレス・SNSのアカウント", "URLs, e-mail or social accounts", "網址・電子郵件・社群帳號", "网址・电子邮件・社交账号", "URL・이메일・SNS 계정"),
    "電話番号": L("電話番号", "phone numbers", "電話號碼", "电话号码", "전화번호"),
    "値段・割引": L("値段・割引", "prices or discounts", "價格・折扣", "价格・折扣", "가격・할인"),
    "セール・宣伝の言葉": L("セール・宣伝の言葉", "sale or promotional words", "特賣・宣傳用語", "特卖・宣传用语", "세일・홍보 문구"),
    "会社の名前": L("会社の名前", "company names", "公司名稱", "公司名称", "회사 이름"),
    "写真を読み込めませんでした": L("写真を読み込めませんでした", "Couldn't load the photo.", "無法讀取照片。", "无法读取照片。", "사진을 불러오지 못했습니다."),
    "色・模様・文字・写真を、白い電車にもどしますか？（おえかきとステッカーは残ります）": L("色・模様・文字・写真を、白い電車にもどしますか？（おえかきとステッカーは残ります）", "Reset colors, pattern, text and photo to a white tram? (Drawings and stickers stay.)", "要把顏色・花紋・文字・照片恢復成白色電車嗎？（繪圖和貼紙會保留）", "要把颜色・花纹・文字・照片恢复成白色电车吗？（绘图和贴纸会保留）", "색・무늬・글자・사진을 하얀 전차로 되돌릴까요? (그림과 스티커는 남습니다)"),
    "ARの準備に失敗しました": L("ARの準備に失敗しました", "Couldn't start AR.", "AR 準備失敗。", "AR 准备失败。", "AR 준비에 실패했습니다."),
    "おえかきとステッカーを全部消しますか？": L("おえかきとステッカーを全部消しますか？", "Clear all drawings and stickers?", "要清除全部繪圖和貼紙嗎？", "要清除全部绘图和贴纸吗？", "그림과 스티커를 모두 지울까요?"),
    "なし": L("なし", "None", "無", "无", "없음"),
    "ストライプ": L("ストライプ", "Stripes", "條紋", "条纹", "줄무늬"),
    "水玉": L("水玉", "Dots", "圓點", "圆点", "물방울"),
    "青海波": L("青海波", "Waves (seigaiha)", "青海波", "青海波", "세이가이하"),
    "チェック": L("チェック", "Check", "格子", "格子", "체크"),
    "波": L("波", "Wavy", "波浪", "波浪", "물결"),
    "ゴシック": L("ゴシック", "Sans", "黑體", "黑体", "고딕"),
    "明朝": L("明朝", "Serif", "明體", "宋体", "명조"),
    "まる文字": L("まる文字", "Rounded", "圓體", "圆体", "둥근 글씨"),
    "rl.title": L("線路で走らせる | ジャッチュ", "Run on the tracks | Jatchu", "在軌道上行駛 | Jatchu", "在轨道上行驶 | Jatchu", "선로에서 달리기 | Jatchu"),
    "rl.home": L("← ホーム", "← Home", "← 首頁", "← 首页", "← 홈"),
    "rl.walk1": L("歩きながらは使えません", "You can't use this while walking", "走路時無法使用", "走路时无法使用", "걸으면서는 사용할 수 없습니다"),
    "rl.walk2": L("立ち止まると、電車がもどります。<br>まわりに気をつけてください。", "Stop walking and the tram comes back.<br>Please watch your surroundings.", "停下腳步，電車就會回來。<br>請注意周圍。", "停下脚步，电车就会回来。<br>请注意周围。", "멈춰 서면 전차가 돌아옵니다.<br>주변을 잘 살펴 주세요."),
    "rl.pl.t": L("🤝 安全の約束", "🤝 Safety promise", "🤝 安全約定", "🤝 安全约定", "🤝 안전 약속"),
    "rl.pl.s": L("3つすべてに✓を付けると、始められます。", "Check all three to start.", "三項全部勾選後即可開始。", "三项全部勾选后即可开始。", "세 가지 모두 ✓하면 시작할 수 있습니다."),
    "rl.pl.1": L("線路や車道には、ぜったいに入りません", "I will never step onto the tracks or the road", "絕對不進入軌道或車道", "绝对不进入轨道或车道", "선로나 차도에는 절대 들어가지 않습니다"),
    "rl.pl.2": L("立ち止まって、歩道や電停の安全な所から使います", "I will stand still and use it from the sidewalk or a safe spot at the stop", "停下腳步，在人行道或電車站的安全處使用", "停下脚步，在人行道或电车站的安全处使用", "멈춰 서서 인도나 정류장의 안전한 곳에서 사용합니다"),
    "rl.pl.3": L("電車や車が来たら、すぐに画面から目をはなします", "I will look away from the screen when a tram or car comes", "電車或汽車靠近時，馬上把視線從畫面移開", "电车或汽车靠近时，马上把视线从画面移开", "전차나 차가 오면 바로 화면에서 눈을 뗍니다"),
    "rl.pl.ok": L("約束して始める", "I promise — start", "我保證，開始", "我保证，开始", "약속하고 시작"),
    "rl.pl.no": L("やめる", "Cancel", "取消", "取消", "그만두기"),
    "rl.floor": L("床", "Floor", "地板", "地板", "바닥"),
    "rl.desk": L("机", "Table", "桌子", "桌子", "책상"),
    "rl.hadj": L("高さあわせ", "Height", "高度調整", "高度调整", "높이 맞추기"),
    "rl.drag": L("👆 なぞると電車を動かせるよ", "👆 Swipe to move the tram", "👆 滑動就能移動電車喔", "👆 滑动就能移动电车哦", "👆 문지르면 전차를 움직일 수 있어"),
    "rl.auto": L("▶ 自動で走らせる", "▶ Run automatically", "▶ 自動行駛", "▶ 自动行驶", "▶ 자동으로 달리기"),
    "rl.real": L("🚋 本物の電車がまもなく来ます。<br>線路や車道から離れて、電車に注意してください", "🚋 A real tram is coming soon.<br>Stay away from the tracks and road, and watch for the tram.", "🚋 真正的電車即將到來。<br>請遠離軌道和車道，注意電車。", "🚋 真正的电车即将到来。<br>请远离轨道和车道，注意电车。", "🚋 진짜 전차가 곧 옵니다.<br>선로와 차도에서 떨어져 전차에 주의해 주세요."),
    "rl.h1": L("線路で走らせる", "Run on the tracks", "在軌道上行駛", "在轨道上行驶", "선로에서 달리기"),
    "rl.sub": L("線路にカメラを向けると、自分の電車が走ってくるよ", "Point your camera at the tracks and your tram comes running", "把相機對準軌道，你的電車就會跑過來喔", "把相机对准轨道，你的电车就会跑过来哦", "선로에 카메라를 비추면 내 전차가 달려와"),
    "rl.mode.tram": L("🚋 自分の電車", "🚋 My tram", "🚋 我的電車", "🚋 我的电车", "🚋 내 전차"),
    "rl.mode.robot": L("🤖 変形ロボ", "🤖 Robo-tram", "🤖 變形機器人", "🤖 变形机器人", "🤖 변신 로봇"),
    "rl.loading": L("読み込み中…", "Loading…", "載入中…", "加载中…", "불러오는 중…"),
    "rl.gogo1": L("暗いランプが流れてきて止まると、<br>光ってこの写真に変わるよ", "A dark lamp rolls in, stops,<br>lights up and turns into this photo", "暗暗的燈流過來停下後，<br>會亮起來變成這張照片喔", "暗暗的灯流过来停下后，<br>会亮起来变成这张照片哦", "어두운 램프가 와서 멈추면<br>빛나면서 이 사진으로 바뀌어"),
    "rl.photonote": L("写真は端末の中だけで使い、送信しません", "Photos stay on this device and are never sent", "照片只在此裝置中使用，不會傳送", "照片只在此设备中使用，不会发送", "사진은 이 기기 안에서만 사용하며 전송하지 않습니다"),
    "rl.warn": L("<b>⚠ 安全のために</b><br>・<b>線路や車道には絶対に立ち入らず</b>、歩道や安全地帯から使ってください<br>・本物の電車や車が近づいたら、すぐに画面から目を離してください<br>・歩きながら使わないでください", "<b>⚠ For your safety</b><br>・<b>Never step onto the tracks or the road.</b> Use it from the sidewalk or a safety island.<br>・Look away from the screen as soon as a real tram or car comes near.<br>・Do not use it while walking.", "<b>⚠ 為了安全</b><br>・<b>絕對不要進入軌道或車道</b>，請在人行道或安全島上使用<br>・真正的電車或汽車靠近時，請馬上把視線從畫面移開<br>・請不要邊走邊使用", "<b>⚠ 为了安全</b><br>・<b>绝对不要进入轨道或车道</b>，请在人行道或安全岛上使用<br>・真正的电车或汽车靠近时，请马上把视线从画面移开<br>・请不要边走边使用", "<b>⚠ 안전을 위해</b><br>・<b>선로나 차도에는 절대 들어가지 말고</b> 인도나 안전지대에서 사용해 주세요<br>・진짜 전차나 차가 다가오면 바로 화면에서 눈을 떼 주세요<br>・걸으면서 사용하지 마세요"),
    "rl.geo": L("位置情報と方位は、近くの線路を調べるためだけに使い、送信・保存しません。", "Location and compass are used only to find nearby tracks, and are never sent or stored.", "位置資訊和方位只用來尋找附近的軌道，不會傳送或儲存。", "位置信息和方位只用来寻找附近的轨道，不会发送或保存。", "위치 정보와 방위는 가까운 선로를 찾는 데만 사용하며 전송・저장하지 않습니다."),
    "rl.more": L("くわしく", "Details", "詳細", "详细", "자세히"),
    "rl.flat": L("🪑 線路がない所（床・机）で走らせる", "🪑 Run it on a floor or table", "🪑 在沒有軌道的地方（地板・桌子）行駛", "🪑 在没有轨道的地方（地板・桌子）行驶", "🪑 선로가 없는 곳(바닥・책상)에서 달리기"),
    "rl.file": L("🎞 撮った動画で試す", "🎞 Try with a video", "🎞 用拍好的影片試試", "🎞 用拍好的视频试试", "🎞 찍은 동영상으로 해 보기"),
    "🚶 立ち止まってください": L("🚶 立ち止まってください", "🚶 Please stop walking", "🚶 請停下腳步", "🚶 请停下脚步", "🚶 멈춰 서 주세요"),
    "本物の電車が通過するまでお待ちください": L("本物の電車が通過するまでお待ちください", "Please wait until the real tram has passed", "請等真正的電車通過", "请等真正的电车通过", "진짜 전차가 지나갈 때까지 기다려 주세요"),
    "もう1本のレールをタップしてね": L("もう1本のレールをタップしてね", "Tap the other rail", "再點另一條鐵軌吧", "再点另一条铁轨吧", "다른 레일 하나를 탭해 줘"),
    " 走行中（レールを探しています）": L(" 走行中（レールを探しています）", " Running (looking for the rails)", " 行駛中（正在尋找鐵軌）", " 行驶中（正在寻找铁轨）", " 달리는 중 (레일을 찾는 중)"),
    "手動で運転中（{d}）": L("手動で運転中（{d}）", "You're driving ({d})", "手動駕駛中（{d}）", "手动驾驶中（{d}）", "직접 운전 중 ({d})"),
    "横にスライド": L("横にスライド", "swipe sideways", "左右滑動", "左右滑动", "옆으로 밀기"),
    "上下にスライド": L("上下にスライド", "swipe up/down", "上下滑動", "上下滑动", "위아래로 밀기"),
    "走行中（{d}）": L("走行中（{d}）", "Running ({d})", "行駛中（{d}）", "行驶中（{d}）", "달리는 중 ({d})"),
    "横から": L("横から", "side view", "側面", "侧面", "옆에서"),
    "正面から": L("正面から", "front view", "正面", "正面", "정면에서"),
    "線路を写してね（正面からでも横からでもOK）": L("線路を写してね（正面からでも横からでもOK）", "Point at the tracks (front or side is OK)", "對準軌道吧（正面或側面都可以）", "对准轨道吧（正面或侧面都可以）", "선로를 비춰 줘 (정면이든 옆이든 OK)"),
    "走行中｜別の所をタップすると置きなおせるよ": L("走行中｜別の所をタップすると置きなおせるよ", "Running | Tap elsewhere to move it", "行駛中｜點別的地方可以重新放置喔", "行驶中｜点别的地方可以重新放置哦", "달리는 중｜다른 곳을 탭하면 다시 놓을 수 있어"),
    "{p}をタップして、電車を置いてね": L("{p}をタップして、電車を置いてね", "Tap the {p} to place your tram", "點一下{p}，把電車放上去吧", "点一下{p}，把电车放上去吧", "{p}을(를) 탭해서 전차를 놓아 줘"),
    "床や机の、もう少し下の方をタップしてね": L("床や机の、もう少し下の方をタップしてね", "Tap a bit lower on the floor or table", "請點地板或桌子再下面一點的地方", "请点地板或桌子再下面一点的地方", "바닥이나 책상의 조금 더 아래쪽을 탭해 줘"),
    "電車": L("電車", "tram", "電車", "电车", "전차"),
    "ロボ電車": L("ロボ電車", "robo-tram", "機器人電車", "机器人电车", "로봇 전차"),
    "ランプ": L("ランプ", "lamp", "燈", "灯", "램프"),
    "{name}が来るまで あと<b>{n}</b>秒": L("{name}が来るまで あと<b>{n}</b>秒", "The {name} arrives in <b>{n}</b>s", "{name}還有<b>{n}</b>秒到", "{name}还有<b>{n}</b>秒到", "{name} 도착까지 <b>{n}</b>초"),
    "{name}が来たよ！": L("{name}が来たよ！", "Here comes the {name}!", "{name}來了！", "{name}来了！", "{name}이(가) 왔어!"),
    "次の{name}まで あと<b>{n}</b>秒": L("次の{name}まで あと<b>{n}</b>秒", "Next {name} in <b>{n}</b>s", "下一班{name}還有<b>{n}</b>秒", "下一班{name}还有<b>{n}</b>秒", "다음 {name}까지 <b>{n}</b>초"),
    "📍 位置情報なし": L("📍 位置情報なし", "📍 No location", "📍 無位置資訊", "📍 无位置信息", "📍 위치 정보 없음"),
    "📍 地図の範囲外": L("📍 地図の範囲外", "📍 Outside the map area", "📍 超出地圖範圍", "📍 超出地图范围", "📍 지도 범위 밖"),
    "📍 線路から約{d}m離れています": L("📍 線路から約{d}m離れています", "📍 About {d} m from the tracks", "📍 距離軌道約{d}公尺", "📍 距离轨道约{d}米", "📍 선로에서 약 {d}m 떨어져 있습니다"),
    "📍 {stop}の近く ・ 線路まで約{d}m（{k}）": L("📍 {stop}の近く ・ 線路まで約{d}m（{k}）", "📍 Near {stop} ・ about {d} m to the tracks ({k})", "📍 {stop}附近 ・ 距離軌道約{d}公尺（{k}）", "📍 {stop}附近 ・ 距离轨道约{d}米（{k}）", "📍 {stop} 근처 ・ 선로까지 약 {d}m ({k})"),
    "複線": L("複線", "double track", "雙線", "双线", "복선"),
    "単線": L("単線", "single track", "單線", "单线", "단선"),
    " ・ 本物の電車 あと{n}分（仮）": L(" ・ 本物の電車 あと{n}分（仮）", " ・ real tram in {n} min (test)", " ・ 真正的電車還有{n}分（暫定）", " ・ 真正的电车还有{n}分（暂定）", " ・ 진짜 전차 {n}분 후 (임시)"),
    "起動中…": L("起動中…", "Starting…", "啟動中…", "启动中…", "시작하는 중…"),
    "カメラを起動できませんでした: ": L("カメラを起動できませんでした: ", "Couldn't start the camera: ", "無法啟動相機：", "无法启动相机：", "카메라를 시작하지 못했습니다: "),
    "もう一度試す": L("もう一度試す", "Try again", "再試一次", "再试一次", "다시 시도"),
    "📷 カメラで始める": L("📷 カメラで始める", "📷 Start with camera", "📷 用相機開始", "📷 用相机开始", "📷 카메라로 시작"),
    "まだ電車がないよ（お手本が走るよ）": L("まだ電車がないよ（お手本が走るよ）", "No trams yet (a sample will run)", "還沒有電車（會跑範例電車喔）", "还没有电车（会跑示例电车哦）", "아직 전차가 없어 (견본이 달려)"),
    "🎨 電車を作る →": L("🎨 電車を作る →", "🎨 Create a tram →", "🎨 製作電車 →", "🎨 制作电车 →", "🎨 전차 만들기 →"),
    "rl.osm": L("地図データ © OpenStreetMap contributors", "Map data © OpenStreetMap contributors", "地圖資料 © OpenStreetMap contributors", "地图数据 © OpenStreetMap contributors", "지도 데이터 © OpenStreetMap contributors"),
    // ---- 作る・走らせる（ここまで） ----
    "tab.run":     L("走らせる", "Run", "奔跑", "奔跑", "달리기"),
    "tab.maker":  L("作る", "Create", "製作", "制作", "만들기"),
    "car":        L("{name}号", "{name} Tram", "{name}號", "{name}号", "{name} 호"),
    "st.ok":      L("○ 空席", "○ Seats", "○ 有空位", "○ 有空位", "○ 자리 있음"),
    "st.few":     L("△ わずか", "△ Few left", "△ 剩少量", "△ 剩少量", "△ 조금 남음"),
    "st.full":    L("× 満席", "× Full", "× 客滿", "× 客满", "× 만석"),
    "min.soon":   L("まもなく", "Arriving", "即將到站", "即将到站", "곧 도착"),
    "min.left":   L("あと<b>{n}</b>分", "in <b>{n}</b> min", "還有<b>{n}</b>分", "还有<b>{n}</b>分", "<b>{n}</b>분 후"),
    "today":      L("本日限定：{m}", "Today only: {m}", "本日限定：{m}", "今日限定：{m}", "오늘 한정: {m}"),
    "safety":     L("⚠ 線路や車道には入らず、歩道や安全地帯で使ってください。",
                    "⚠ Never step onto the tracks or the road. Use it from the sidewalk or the tram stop.",
                    "⚠ 請勿進入軌道或車道，請在人行道或安全島上使用。",
                    "⚠ 请勿进入轨道或车道，请在人行道或安全岛上使用。",
                    "⚠ 선로나 차도에 들어가지 말고, 보도나 안전지대에서 사용하세요."),

    // トップ（index.html）
    "idx.title":   L("ジャッチュ | 自分の電車をデザインして走らせる", "Jatchu | Design your own tram and make it run", "Jatchu | 設計自己的電車讓它跑起來", "Jatchu | 设计自己的电车让它跑起来", "자추 | 나만의 전차를 디자인해서 달리게 하자"),
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

    "idx.rail2":   L("🛤 線路で走らせる", "🛤 Run on real tracks", "🛤 在真正的軌道上跑", "🛤 在真正的轨道上跑", "🛤 진짜 선로에서 달리기"),
    "idx.mine":    L("🚃 自分の電車", "🚃 My trams", "🚃 我的電車", "🚃 我的电车", "🚃 내 전차"),
    "idx.s2b":     L("3D・ARで見る", "See it in 3D & AR", "用3D・AR觀看", "用3D・AR观看", "3D・AR로 보기"),
    "idx.s3b":     L("線路で走らせる", "Run it on real tracks", "在真正的軌道上跑", "在真正的轨道上跑", "진짜 선로에서 달리기"),
    "idx.demo":    L("🧪 デモ版（以前の試作）を見る", "🧪 See the demo (earlier prototype)", "🧪 查看示範版（之前的試作）", "🧪 查看演示版（之前的试作）", "🧪 데모판(이전 시제품) 보기"),

    // はじめての人向けの案内（index.html）
    "ob.help":     L("使い方", "How it works", "使用方法", "使用方法", "사용 방법"),
    "ob.skip":     L("スキップ", "Skip", "略過", "跳过", "건너뛰기"),
    "ob.next":     L("次へ", "Next", "下一步", "下一步", "다음"),
    "ob.start":    L("🎨 作ってみる", "🎨 Start designing", "🎨 馬上開始製作", "🎨 马上开始制作", "🎨 바로 만들기"),
    "ob.home":     L("ホームへ", "Go to Home", "看首頁", "看首页", "홈 보기"),
    "ob.t1":       L("電車をデザインする", "Design a tram", "設計電車", "设计电车", "전차 디자인하기"),
    "ob.d1":       L("色・模様・文字・写真・ステッカーで、自分だけの電車を作ろう。", "Make your own tram with colors, patterns, text, photos and stickers.", "用顏色・花紋・文字・照片・貼紙，做出你自己的電車吧。", "用颜色・花纹・文字・照片・贴纸，做出你自己的电车吧。", "색・무늬・글자・사진・스티커로 나만의 전차를 만들어 보자."),
    "ob.t2":       L("3D・ARで見る", "See it in 3D & AR", "用3D・AR觀看", "用3D・AR观看", "3D・AR로 보기"),
    "ob.d2":       L("3Dで回して見たり、ARで机の上を走らせたりできるよ。", "Spin it in 3D, or run it on your table in AR.", "可以用3D轉來看，也能用AR在桌上跑喔。", "可以用3D转来看，也能用AR在桌上跑哦。", "3D로 돌려 보거나 AR로 책상 위를 달리게 할 수 있어."),
    "ob.t3":       L("線路で走らせる", "Run it on real tracks", "在真正的軌道上跑", "在真正的轨道上跑", "진짜 선로에서 달리기"),
    "ob.d3":       L("線路にカメラを向けると、自分の電車が走ってくるよ。", "Point your camera at the tracks and your tram comes running.", "把相機對準軌道，你的電車就會跑過來喔。", "把相机对准轨道，你的电车就会跑过来哦。", "선로에 카메라를 비추면 내 전차가 달려와."),
    "ob.safe":     L("⚠ 線路や車道には入らず、歩道や安全地帯で使ってください。",
                     "⚠ Never step onto the tracks or the road. Use it from the sidewalk or the tram stop.",
                     "⚠ 絕對不要進入軌道或車道，請在人行道或安全島上使用。",
                     "⚠ 绝对不要进入轨道或车道，请在人行道或安全岛上使用。",
                     "⚠ 선로나 차도에는 절대 들어가지 말고, 보도나 안전지대에서 사용하세요."),

    // じぶんの電車（mine.html）
    "my.title":    L("🚃 自分の電車", "🚃 My trams", "🚃 我的電車", "🚃 我的电车", "🚃 내 전차"),
    "my.sub":      L("スワイプで速さを変えて、タップで編集できるよ。", "Swipe to change the speed. Tap a tram to edit it.", "滑動可以改變速度，點一下就能修改喔。", "滑动可以改变速度，点一下就能修改哦。", "스와이프로 속도를 바꾸고, 탭해서 고칠 수 있어."),
    "my.empty":    L("まだ電車がないよ。「作る」から作ってみよう！", "No trams yet. Make one in “Create”.", "還沒有電車。到「製作」做做看吧！", "还没有电车。到「制作」做做看吧！", "아직 전차가 없어. ‘만들기’에서 만들어 보자!"),
    "my.make":     L("＋ 新しく作る", "+ Make a new tram", "＋ 做一台新電車", "＋ 做一台新电车", "+ 새 전차 만들기"),
    "my.list":     L("保存した電車（{n}台）", "Saved trams ({n})", "已儲存的電車（{n}台）", "已保存的电车（{n}台）", "저장한 전차 ({n}대)"),
    "my.none":     L("まだありません", "None yet", "還沒有", "还没有", "아직 없어요"),
    "my.when":     L("{d} に保存", "Saved {d}", "{d} 儲存", "{d} 保存", "{d} 저장"),
    "my.sample":   L("お手本の電車", "Sample tram", "範例電車", "示例电车", "견본 전차"),
    "my.run":      L("🛤 線路で走らせる", "🛤 Run on real tracks", "🛤 在真正的軌道上跑", "🛤 在真正的轨道上跑", "🛤 진짜 선로에서 달리기"),
    "my.edit":     L("✏️ 編集・3Dで見る", "✏️ Edit · see in 3D & AR", "✏️ 修改・用3D和AR看", "✏️ 修改・用3D和AR看", "✏️ 고치기・3D와 AR로 보기"),
    "my.del":      L("🗑 消す", "🗑 Delete this tram", "🗑 刪除這台電車", "🗑 删除这台电车", "🗑 이 전차 지우기"),
    "my.delq":     L("「{name}」を消しますか？元にもどせません。", "Delete “{name}”? (This can't be undone)", "要刪除「{name}」嗎？（無法復原）", "要删除「{name}」吗？（无法恢复）", "‘{name}’을(를) 지울까요? (되돌릴 수 없어요)"),
    "my.note":     L("※ 作った電車は、このスマホの中だけに保存されます。", "* Your trams are saved only on this phone.", "※ 你做的電車只會儲存在這支手機裡。", "※ 你做的电车只会保存在这部手机里。", "※ 만든 전차는 이 스마트폰에만 저장됩니다."),

    // みんなの電車（gallery.html）
    "gl.title":    L("👀 みんなの電車", "👀 Everyone's trams", "👀 大家的電車", "👀 大家的电车", "👀 모두의 전차"),
    "gl.sub":      L("左右にスワイプして速さを変えよう。電車をタップすると、いいね・コメントできます。",
                     "Swipe left or right to change the speed. Tap a tram to like it or leave a comment.",
                     "左右滑動來改變速度。點一下電車就能按讚・留言。",
                     "左右滑动来改变速度。点一下电车就能点赞・留言。",
                     "좌우로 스와이프해서 속도를 바꿔 보세요. 전차를 탭하면 좋아요・댓글을 남길 수 있어요."),
    "gl.hint":     L("👆 スワイプ", "👆 Swipe!", "👆 滑動！", "👆 滑动！", "👆 스와이프!"),
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
    "gl.mine.new": L("🎉 あなたの電車が走ってくるよ！", "🎉 Here comes your tram!", "🎉 你的電車來了！", "🎉 你的电车来了！", "🎉 내 전차가 달려와요!"),
    "gl.note":     L("※ 試作版です。いいね・コメントは、この端末の中だけに保存されます（ほかの人には見えません）。サンプルの電車のいいね数・コメントは例です。",
                     "* Prototype: likes and comments are saved only on this device (other people can't see them). The likes and comments on sample trams are examples.",
                     "※ 試作版。按讚・留言只會存在這台裝置裡（其他人看不到）。範例電車的讚數・留言只是例子。",
                     "※ 试作版。点赞・留言只会保存在这台设备里（其他人看不到）。示例电车的赞数・留言只是例子。",
                     "※ 시범 버전입니다. 좋아요・댓글은 이 기기에만 저장돼요(다른 사람에게는 보이지 않아요). 샘플 전차의 좋아요 수・댓글은 예시입니다."),
    "idx.qr":      L("🖨 QRコードの貼り紙をつくる（運営用）", "🖨 Print QR posters (for staff)", "🖨 製作QR海報（工作人員用）", "🖨 制作QR海报（工作人员用）", "🖨 QR 포스터 만들기 (운영자용)"),
    "idx.h1":      L("自分の電車を<br><em>デザイン</em>して、走らせよう", "<em>Design</em> your own tram,<br>then let it run!", "<em>設計</em>你自己的電車，<br>讓它跑起來吧", "<em>设计</em>你自己的电车，<br>让它跑起来吧", "나만의 전차를 <em>디자인</em>하고<br>달리게 하자"),
    "idx.lead":    L("色・模様・絵・ステッカーで1台だけの電車を作って、ARで走らせよう！", "Make a one-of-a-kind tram and run it in AR.", "用顏色・圖案・塗鴉・貼紙做出唯一的電車，用AR讓它跑起來吧！", "用颜色・图案・涂鸦・贴纸做出唯一的电车，用AR让它跑起来吧！", "색・무늬・그림・스티커로 하나뿐인 전차를 만들어 AR로 달리게 해 보자!"),
    "idx.cta":     L("🎨 電車を作る", "🎨 Design a tram", "🎨 製作電車", "🎨 制作电车", "🎨 전차 만들기"),
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
    root.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.dataset.i18nPh)); });
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

  // オフライン用のしくみ（sw.js）を使い始める。2回目から速く開き、電波がなくても動く
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  window.JL = { get lang() { return lang; }, LANGS, t, pick, name, shop, status, apply, set, switcher };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => apply());
  else apply();
})();
