/* =====================================================================
   ROCK GENEALOGY — DATA
   ロックの系譜データ

   各ジャンルは「進化の枝」。parents で親ジャンルへつながる有向グラフ(DAG)。
   gen = 世代(縦の行 / 時代の深さ)、x = 横位置(0.0〜1.0)。
   song の q はYouTube検索クエリ、yt があればその場で埋め込み再生。
   ===================================================================== */

const ERAS = [
  {
    id: "roots",
    label: "1940s–50s",
    title: "根 — 大移動とラジオの時代",
    body:
      "ロックの遺伝子は、一本の川ではなく複数の源流が合流して生まれた。アフリカ系アメリカ人が南部から北部の工業都市へ移り住んだ「大移動(Great Migration)」は、農村のカントリー・ブルースを電化されたシカゴ・ブルースへと変えた。第二次大戦後の好景気、10代という新しい消費者層(ティーンエイジャー)の誕生、そして安価なラジオとジュークボックスが、それまで人種で分断されていた「黒人のR&B」と「白人のカントリー」を同じ電波に乗せた。人種隔離(ジム・クロウ法)が色濃く残る社会で、若者たちはラジオの中だけで交わる音に熱狂した。ロックンロールは、この禁じられた越境から生まれた。",
  },
  {
    id: "60s",
    label: "1960s",
    title: "爆発 — 反抗・公民権・サイケデリア",
    body:
      "ケネディ暗殺、ベトナム戦争の泥沼化、公民権運動、そしてカウンターカルチャー。1960年代は世界が音を立てて変わった10年だった。イギリスの若者がアメリカのブルースを輸入して磨き上げ(ブリティッシュ・インヴェイジョン)、逆輸入する形でロックは世界言語になった。ボブ・ディランがフォークに社会批評を持ち込み、ビートルズが実験を重ね、LSDと東洋思想がサイケデリアを開花させた。音楽はもはや踊るためだけのものではなく、意識を拡張し、体制に異議を唱えるメディアになった。ウッドストック(1969)はその頂点であり、同時に理想主義の終わりの始まりでもあった。",
  },
  {
    id: "70s",
    label: "1970s",
    title: "分化 — 重厚・様式美・そして破壊",
    body:
      "ヒッピーの夢が醒めた70年代、ロックは巨大産業へと成長し、同時に細分化した。スタジアムを満たすハードロック、組曲のように壮大化するプログレッシブ・ロック、両性具有の美学を掲げるグラム。オイルショックと不況、失業にあえぐ英国の若者たちは、肥大化した「産業ロック」への怒りをパンクとして爆発させた。『3コードあれば誰でもバンドを組める』——技巧より態度を、洗練より衝動を選ぶこの宣言は、音楽の民主化であり、次の10年の全ての出発点になった。",
  },
  {
    id: "80s",
    label: "1980s",
    title: "拡散 — MTV・冷戦・地下と地上",
    body:
      "1981年のMTV開局は、ロックを「見る」ものに変えた。ビジュアルとシンセサイザーがものを言うニューウェイヴやシンセポップが地上を支配する一方、その裏では地下水脈が張り巡らされた。パンクの遺伝子はハードコアへと先鋭化し、大学ラジオを拠点にオルタナティヴが育ち、メタルはスラッシュへと高速化した。レーガンとサッチャーの保守政治、冷戦下の核の恐怖、エイズの流行、都市の荒廃——時代の不安は、ゴシックの耽美にも、ハードコアの怒りにも、等しく刻まれている。",
  },
  {
    id: "90s",
    label: "1990s",
    title: "臨界 — 冷戦後の倦怠とオルタナの勝利",
    body:
      "ベルリンの壁崩壊とソ連解体で冷戦が終わり、大きな物語が消えた後に残ったのは、豊かさの中の空虚だった。ニルヴァーナの登場は、地下で育ったオルタナティヴを一夜にして世界の中心へ押し上げ、産業化したメタルを一掃した。シアトルのグランジ、英国の自意識過剰なブリットポップ、轟音に沈むシューゲイズ——90年代のロックは、勝利と引き換えに『何に反抗すればいいのか分からない』という新しい問いを抱えた。インターネットの黎明が、次の断片化の時代を静かに準備していた。",
  },
  {
    id: "00s",
    label: "2000s–",
    title: "再生 — デジタル、リヴァイヴァル、拡散する系譜",
    body:
      "ナップスターとiPod、そしてストリーミングが、アルバムという単位とロックの産業構造を溶かした。ジャンルの一直線の進化は終わり、過去の全てが同時にアクセス可能な『データベース』になった。ストロークスやホワイト・ストライプスは60〜70年代の生々しさを甦らせ(ガレージ/ポストパンク・リヴァイヴァル)、メタルコアやエモは細分化を極めた。ロックはもはや音楽の王座を降りたが、その遺伝子はヒップホップからポップ、ベッドルームで作られるインディーまで、あらゆる場所に拡散し、静かに生き続けている。",
  },
];

const GENRES = [
  /* ---------------- ROOTS ---------------- */
  {
    id: "blues",
    name: "ブルース",
    en: "Blues",
    gen: 0, x: 0.14, years: "1900s–",
    parents: [],
    hue: 205,
    tagline: "全ての源流。悲しみを12小節に閉じ込めた祈り。",
    interpretation:
      "『ロックの母』と呼ばれるが、ブルース自体はロックではない。アフリカの労働歌・フィールドハラー、そしてゴスペルを土壌に、アメリカ南部の黒人社会が生んだ音楽だ。厳密には戦前のデルタ・ブルース(アコースティック)と、大移動後のシカゴ・ブルース(電化)は別物と見る立場もあり、ロックに直接つながったのは後者だとされる。",
    sound:
      "12小節形式、I-IV-Vのコード進行、そして長調でも短調でもない『ブルーノート』が核。ギターやハーモニカで音程を滑らせるベンド/スライド、コール&レスポンスの構造。歌詞は貧困・恋愛・放浪など個人的な苦悩を歌う。",
    visual:
      "作業着や中折れ帽、埃っぽい南部のジューク・ジョイント。エレクトリック化以降はシャープなスーツ姿。『十字路で悪魔に魂を売った』というロバート・ジョンソン伝説に象徴される、神話的で土着的なイメージ。",
    era: "1900年代初頭に南部で成立し、1940〜50年代のシカゴで電化。ロックンロールの直接の親となった。",
    artists: [
      { name: "Robert Johnson", note: "デルタ・ブルースの伝説。27歳で夭折し、後のロック全てに影を落とす。",
        songs: [{ t: "Cross Road Blues", q: "Robert Johnson Cross Road Blues", sp: "1TrGdXSgiBm8W68D2K1COG" }, { t: "Sweet Home Chicago", q: "Robert Johnson Sweet Home Chicago", sp: "3zf9b2FixBUBrfNUpdi1ML" }] },
      { name: "Muddy Waters", note: "デルタを電化しシカゴ・ブルースを確立。『ローリング・ストーンズ』の名の由来。",
        songs: [{ t: "Rollin' Stone", q: "Muddy Waters Rollin Stone", sp: "61K6lqGyrl2Aerk0LjAZem" }, { t: "Hoochie Coochie Man", q: "Muddy Waters Hoochie Coochie Man", sp: "3KSchPNSklO5McIqRH3qYX" }] },
      { name: "B.B. King", note: "泣きのギター『ルシール』。ブルースを世界の大衆音楽へ橋渡しした。",
        songs: [{ t: "The Thrill Is Gone", q: "B.B. King The Thrill Is Gone", sp: "4NQfrmGs9iQXVQI9IpRhjM" }, { t: "Every Day I Have the Blues", q: "B.B. King Every Day I Have the Blues", sp: "6MrLjEmXy9IAPAX1mAKySE" }] },
    ],
  },
  {
    id: "rnb_gospel",
    name: "R&B / ゴスペル",
    en: "Rhythm & Blues / Gospel",
    gen: 0, x: 0.38, years: "1940s–50s",
    parents: [],
    hue: 280,
    tagline: "教会の恍惚と土曜の夜の熱狂。",
    interpretation:
      "『リズム&ブルース』は当初、レコード業界が黒人向け音楽を指した商業用語で、内実はジャンプ・ブルース、ドゥーワップ、初期ソウルなど幅広い。神を讃えるゴスペルの高揚が世俗の欲望と結びつくとき、ロックンロールのエネルギーが生まれた——この『聖と俗の融合』こそロックの原動力だとする見方は根強い。",
    sound:
      "ゴスペル由来のメリスマ(こぶし)と叫び、跳ねるシャッフルのリズム、ホーンセクション、8ビートへ向かう躍動。教会のコール&レスポンスがそのまま観客との一体感に転化する。",
    visual:
      "着飾ったステージ衣装、汗と情熱のパフォーマンス。教会のクワイアの荘厳さと、ダンスホールの華やかさが同居する。",
    era: "1940〜50年代に隆盛。ロックンロールへ直接流れ込み、同時に後のソウル/ファンクの母体にもなった。",
    artists: [
      { name: "Little Richard", note: "『ロックの建築家』。叫びとピアノの乱打で、聖と俗の境界を破壊した。",
        songs: [{ t: "Tutti Frutti", q: "Little Richard Tutti Frutti", sp: "2iXcvnD3d1gfLBum0cE5Eg" }, { t: "Long Tall Sally", q: "Little Richard Long Tall Sally", sp: "28iKx3wpnJSNvQONt0HQrt" }] },
      { name: "Ray Charles", note: "ゴスペルとブルースを融合し『ソウル』を発明した天才。",
        songs: [{ t: "What'd I Say", q: "Ray Charles What'd I Say", sp: "6h4rAPuTPv0iAI1NaF2SRL" }, { t: "I Got a Woman", q: "Ray Charles I Got a Woman", sp: "2xar08Fq5xra2KKZs5Bw9j" }] },
    ],
  },
  {
    id: "country",
    name: "カントリー / フォーク",
    en: "Country / Folk",
    gen: 0, x: 0.64, years: "1920s–",
    parents: [],
    hue: 40,
    tagline: "白人労働者の物語歌。大地と信仰の音。",
    interpretation:
      "アパラチア山脈の移民が持ち込んだ英国・アイルランドの民謡(フォーク)と、それが商業化したカントリー(ヒルビリー)。ブルースが黒人の音なら、これは白人の音——だが両者は南部で絶えず交わっており、この『白い川』と『黒い川』の合流点にロックンロールがあると理解するのが実態に近い。",
    sound:
      "アコースティック・ギター、バンジョー、フィドル、スティール・ギター。物語性の強い歌詞、素朴なメロディ、2ビートの跳ねるリズム(ホンキートンク)。フォークは社会や共同体の記憶を語り継ぐ機能を持つ。",
    visual:
      "カウボーイハットとブーツ、田園と鉄道、質素な労働者の暮らし。フォークは労働運動や公民権運動と結びつく素朴で誠実なイメージ。",
    era: "1920年代に録音文化が始まり、戦後に全国化。ロカビリーを介してロックンロールに、フォークは60年代フォーク・ロックへ流れ込む。",
    artists: [
      { name: "Hank Williams", note: "カントリーの魂。孤独と信仰を歌い29歳で死去、後世に神話を残す。",
        songs: [{ t: "I'm So Lonesome I Could Cry", q: "Hank Williams I'm So Lonesome I Could Cry", sp: "4tj7IsJrn4MvesuhoY0JBy" }, { t: "Your Cheatin' Heart", q: "Hank Williams Your Cheatin Heart", sp: "4gGKgDtkpytZtYFsUhY6SA" }] },
      { name: "Woody Guthrie", note: "『このギターはファシストを殺す』。フォークを抵抗の武器にした父。",
        songs: [{ t: "This Land Is Your Land", q: "Woody Guthrie This Land Is Your Land", sp: "3ZjrfGcb3A2PMGA1vRNgSk" }] },
    ],
  },

  /* ---------------- 1950s ---------------- */
  {
    id: "rocknroll",
    name: "ロックンロール",
    en: "Rock 'n' Roll",
    gen: 1, x: 0.40, years: "1954–1963",
    parents: ["blues", "rnb_gospel", "country"],
    hue: 0,
    tagline: "全てが始まった爆発点。三つの川の合流。",
    interpretation:
      "『誰が発明したか』は永遠の論争だ。黒人R&Bをそのまま演奏したチャック・ベリーやリトル・リチャードを起点とする説、白人がそれを『安全な』商品にしたことで大衆化したとする説(=文化盗用批判)、ロカビリーという融合形態を重視する説。確かなのは、これが人種の壁を越えた最初のポップ音楽であり、『ティーンエイジャー』という文化を発明したことだ。",
    sound:
      "ブルースの12小節、跳ねる8ビート(バックビート)、電化ギターのリフとソロ。ダンサブルで直情的、2〜3分に凝縮された歌。ロカビリーはこれにカントリーの跳ねとエコー処理を加えた。",
    visual:
      "リーゼントと革ジャン、ポマード、ピンナップ、真っ赤なキャデラック。ダンスに身をよじる若者と、それに眉をひそめる大人たち——世代間対立の視覚的原型。",
    era: "1954年前後に爆発。だが50年代末には主要人物が兵役・事故・スキャンダルで次々退場し、60年代初頭に一度沈静化する。",
    artists: [
      { name: "Chuck Berry", note: "ロックンロールの詩人にして建築家。ギターリフと若者賛歌の文法を作った。",
        songs: [{ t: "Johnny B. Goode", q: "Chuck Berry Johnny B Goode", sp: "2QfiRTz5Yc8DdShCxG1tB2" }, { t: "Roll Over Beethoven", q: "Chuck Berry Roll Over Beethoven", sp: "6C7aTTCUWRK7dD379yUT3W" }] },
      { name: "Elvis Presley", note: "『キング』。黒人音楽を白人の身体で大衆化し、光と影の両方を象徴する。",
        songs: [{ t: "Jailhouse Rock", q: "Elvis Presley Jailhouse Rock", sp: "4gphxUgq0JSFv2BCLhNDiE" }, { t: "Hound Dog", q: "Elvis Presley Hound Dog", sp: "64Ny7djQ6rNJspquof2KoX" }] },
      { name: "Bo Diddley", note: "『ボ・ディドリー・ビート』という永遠のリズムを刻印した革新者。",
        songs: [{ t: "Bo Diddley", q: "Bo Diddley Bo Diddley", sp: "2R7uUQ0Dehu80gsOcydQC9" }, { t: "Who Do You Love?", q: "Bo Diddley Who Do You Love", sp: "0FeFR2V5TcqS0GcL8qwvxr" }] },
    ],
  },

  /* ---------------- 1960s ---------------- */
  {
    id: "surf",
    name: "サーフ・ロック",
    en: "Surf Rock",
    gen: 2, x: 0.10, years: "1961–1965",
    parents: ["rocknroll"],
    hue: 190,
    tagline: "リバーブに濡れた西海岸の夏。",
    interpretation:
      "ディック・デイルらのインストゥルメンタル(=波の音を描写する器楽)を本流とみるか、ビーチ・ボーイズのコーラス・ポップまで含めるかで範囲が変わる。前者を『真のサーフ』、後者を『サーフ・ポップ』と区別する愛好家も多い。",
    sound:
      "スプリング・リバーブを深くかけたギター、速いトレモロ・ピッキング、中東音階やメキシコ音楽の影響。ビーチ・ボーイズ系はそこに緻密な多層コーラスを重ねた。",
    visual:
      "サーフボードとウッディ(木製ワゴン車)、日焼けした健全な若者、カリフォルニアの太陽。豊かなアメリカの束の間の楽園像。",
    era: "1961〜65年に西海岸で流行。ブリティッシュ・インヴェイジョンに市場を奪われ短命に終わるが、後のパンクやインディーが繰り返し参照する。",
    artists: [
      { name: "The Beach Boys", note: "ブライアン・ウィルソンの和声実験は『ペット・サウンズ』でポップの限界を押し広げた。",
        songs: [{ t: "Good Vibrations", q: "The Beach Boys Good Vibrations", sp: "7tf64lNC31lWlTsih0nfZf" }, { t: "Wouldn't It Be Nice", q: "The Beach Boys Wouldn't It Be Nice", sp: "6VojZJpMyuKClbwyilWlQj" }] },
      { name: "Dick Dale", note: "『サーフ・ギターの王』。速弾きとリバーブで波の轟音を表現した。",
        songs: [{ t: "Misirlou", q: "Dick Dale Misirlou", sp: "3OnCnEWgy79xR5pr2kv4TX" }] },
    ],
  },
  {
    id: "british_invasion",
    name: "ブリティッシュ・インヴェイジョン",
    en: "British Invasion / Beat",
    gen: 2, x: 0.36, years: "1964–1967",
    parents: ["rocknroll", "rnb_gospel"],
    hue: 15,
    tagline: "アメリカの音を輸入し、世界へ撃ち返した英国の逆襲。",
    interpretation:
      "『ビート・グループ』(マージービート)とも呼ばれる。英国の若者が米国のロックンロールとR&Bを模倣・純化して逆輸入した現象。ビートルズを芸術革新の軸とみるか、社会現象(ビートルマニア)として捉えるかで評価が割れる。いずれにせよ、これ以降ロックの主導権は一時的に英国へ移った。",
    sound:
      "きらめくエレキ・ギターのアルペジオ、タイトなコーラス・ハーモニー、キャッチーなメロディ。初期は単純だが、ビートルズは急速にスタジオを楽器化し、和声・録音技術を革新していった。",
    visual:
      "そろいのスーツとマッシュルーム・カット、悲鳴を上げる少女たち。やがてカラフルでモッズ的な洗練へ。『若さ』が世界的なブランドになった瞬間。",
    era: "1964年のビートルズ米国上陸で爆発。60年代後半にはサイケデリアへと各バンドが変貌していく。",
    artists: [
      { name: "The Beatles", note: "ポップを芸術に変えた最重要バンド。約7年で音楽の可能性を丸ごと書き換えた。",
        songs: [{ t: "A Hard Day's Night", q: "The Beatles A Hard Day's Night", sp: "4i8BNcagbah58BrHjnsKdN" }, { t: "Ticket to Ride", q: "The Beatles Ticket to Ride", sp: "7CZiDzGVjUssMSOXrDNYHL" }] },
      { name: "The Kinks", note: "歪んだギターリフ(『You Really Got Me』)はハードロックとパンク双方の祖型。",
        songs: [{ t: "You Really Got Me", q: "The Kinks You Really Got Me", sp: "6tZdL3Zp8JgrfDbsSeSV1S" }, { t: "Waterloo Sunset", q: "The Kinks Waterloo Sunset", sp: "4qSk2aeaE2dh5ZOP0JdaV3" }] },
    ],
  },
  {
    id: "folk_rock",
    name: "フォーク・ロック",
    en: "Folk Rock",
    gen: 2, x: 0.82, years: "1965–1968",
    parents: ["country", "british_invasion"],
    hue: 55,
    tagline: "詩がエレキを手にした日。",
    interpretation:
      "ボブ・ディランが1965年、フォーク・フェスでエレキを弾き『裏切り者』と罵倒された事件は象徴的だ。フォークの『真正さ(誠実な語り)』と、ロックの『商業性/電化』は対立するものと信じられていた。フォーク・ロックはその禁忌を破り、ポップに文学的・政治的な重みを持ち込んだ。",
    sound:
      "12弦ギターのきらめき(リッケンバッカー)、内省的・社会批評的な歌詞、美しいハーモニー。ビートルズのメロディ感覚とディランの言葉が交配した形。",
    visual:
      "サングラスとくしゃくしゃの髪、大学キャンパス、公民権運動のプラカード。反戦とヒッピー文化に接続する知的で反骨的なイメージ。",
    era: "1965〜68年に隆盛。サイケデリアやカントリー・ロック、そして後のシンガーソングライター文化へ枝分かれする。",
    artists: [
      { name: "Bob Dylan", note: "ロックに『言葉』の革命を持ち込んだ。ノーベル文学賞受賞。",
        songs: [{ t: "Like a Rolling Stone", q: "Bob Dylan Like a Rolling Stone", sp: "3AhXZa8sUQht0UEdBJgpGc" }, { t: "The Times They Are a-Changin'", q: "Bob Dylan The Times They Are a-Changin", sp: "52vA3CYKZqZVdQnzRrdZt6" }] },
      { name: "The Byrds", note: "リッケンバッカー12弦の煌めきでフォーク・ロックの音を定義した。",
        songs: [{ t: "Mr. Tambourine Man", q: "The Byrds Mr Tambourine Man", sp: "2HCaIYjkvWSZzaSKUoOh3d" }, { t: "Turn! Turn! Turn!", q: "The Byrds Turn Turn Turn", sp: "6gXvSIpr8NJykVdczO82J7" }] },
    ],
  },
  {
    id: "garage",
    name: "ガレージ・ロック",
    en: "Garage Rock",
    gen: 2, x: 0.58, years: "1964–1968",
    parents: ["rocknroll", "british_invasion"],
    hue: 25,
    tagline: "下手くそでいい。ガレージから世界を怒鳴れ。",
    interpretation:
      "北米の無数のアマチュア少年バンドが、ブリティッシュ・インヴェイジョンを稚拙に模倣した現象の総称。当時ジャンルとして意識されておらず、70年代の編集盤『Nuggets』が後から『発見』した。この『素人性の称揚』こそパンクの精神的祖先とされる。",
    sound:
      "荒く歪んだギター、単純な3コード、ファズやチープなオルガン、投げやりで攻撃的なボーカル。技巧の欠如を逆手に取ったエネルギー。",
    visual:
      "郊外の家のガレージ、安物の機材、退屈な10代の反抗。洗練とは対極の、DIYの原風景。",
    era: "1964〜68年に無数に現れ消えた。プロト・パンク(ストゥージズ/MC5)を経て、70年代パンクへ精神を受け渡す。",
    artists: [
      { name: "The Sonics", note: "60年代とは思えない過激な歪みと絶叫。パンクの遥かな先駆。",
        songs: [{ t: "Psycho", q: "The Sonics Psycho", sp: "77DvhwGhnmfrXWwiJzeIMC" }, { t: "Have Love Will Travel", q: "The Sonics Have Love Will Travel", sp: "2uXkW8uJcOIhlbUatEPLPs" }] },
      { name: "The Stooges", note: "イギー・ポップの自己破壊的なパフォーマンス。プロト・パンクの核。",
        songs: [{ t: "I Wanna Be Your Dog", q: "The Stooges I Wanna Be Your Dog", sp: "672N8DGGTOLCOgWe0koX5g" }, { t: "Search and Destroy", q: "The Stooges Search and Destroy", sp: "7bebHZwpRnV1r2CDsuApgD" }] },
    ],
  },
  {
    id: "blues_rock",
    name: "ブルース・ロック",
    en: "Blues Rock",
    gen: 3, x: 0.20, years: "1966–1972",
    parents: ["blues", "british_invasion"],
    hue: 215,
    tagline: "英国の若者が、失われたブルースを爆音で甦らせた。",
    interpretation:
      "皮肉なことに、忘れられかけた黒人ブルースを世界に再認識させたのは英国の白人バンドだった。この『白人によるブルースの再発見』を、賛辞(伝道)とみるか収奪とみるかは今も議論がある。ここからハードロックとヘヴィメタルという巨大な系統が生まれる。",
    sound:
      "ブルースの進行を大音量・長尺で展開。歪んだギターの即興ソロ、ギター・ヒーローの誕生。ジミ・ヘンドリックスはそこにフィードバックとサイケを注ぎ、ギターそのものを再発明した。",
    visual:
      "長髪とベルボトム、マーシャルの壁、汗だくの長時間ジャム。ギターと格闘する『ヒーロー』の身体性。",
    era: "1966〜72年に隆盛。ハードロック/メタル、サザン・ロック、ジャム・バンドへ枝分かれしていく。",
    artists: [
      { name: "The Jimi Hendrix Experience", note: "ギターの概念を破壊し再創造した革命家。全ての後続ギタリストの原点。",
        songs: [{ t: "Voodoo Child (Slight Return)", q: "Jimi Hendrix Voodoo Child Slight Return", sp: "2AxCeJ6PSsBYiTckM0HLY7" }, { t: "Purple Haze", q: "Jimi Hendrix Purple Haze", sp: "0wJoRiX5K5BxlqZTolB2LD" }] },
      { name: "Cream", note: "クラプトンらによる史上初の『スーパーグループ』。長尺の即興演奏を確立。",
        songs: [{ t: "Sunshine of Your Love", q: "Cream Sunshine of Your Love", sp: "2K2M0TcglCRLLpFOzKeFZA" }, { t: "White Room", q: "Cream White Room", sp: "3Xls4cNOwy01dtrNXb1inG" }] },
      { name: "The Rolling Stones", note: "ブルースへの偏愛を核に、60年以上走り続ける『世界最高のロックンロール・バンド』。",
        songs: [{ t: "(I Can't Get No) Satisfaction", q: "The Rolling Stones Satisfaction", sp: "2PzU4IB8Dr6mxV3lHuaG34" }, { t: "Gimme Shelter", q: "The Rolling Stones Gimme Shelter", sp: "6H3kDe7CGoWYBabAeVWGiD" }] },
    ],
  },
  {
    id: "psychedelic",
    name: "サイケデリック・ロック",
    en: "Psychedelic Rock",
    gen: 3, x: 0.52, years: "1966–1970",
    parents: ["british_invasion", "folk_rock", "garage"],
    hue: 300,
    tagline: "音で意識を拡張する。内なる宇宙への旅。",
    interpretation:
      "LSD体験の音楽的再現を目指したとされるが、実際にはインド音楽・現代音楽・スタジオ実験の総合だった。サンフランシスコ(ヒッピー/ジャム志向)と英国(童話的/実験的)で性格が大きく異なり、ひとつのジャンルとして括ることの是非も問われる。ロックが『芸術』を自称し始めた分岐点。",
    sound:
      "シタールやメロトロン、逆回転テープ、長いインプロヴィゼーション、変則的な曲構成、フェイザーやワウの多用。歌詞は幻想的・神秘的。スタジオ自体が楽器になった。",
    visual:
      "液体を使ったライトショー、渦巻く極彩色、マンダラ、スウィンギング・ロンドンの花柄。意識の溶解を視覚化した万華鏡的美学。",
    era: "1966〜70年に頂点。ウッドストックで理想を掲げ、オルタモントの悲劇とドラッグ禍で急速に色褪せる。プログレ/ハードロック/クラウトロックへ分化。",
    artists: [
      { name: "Pink Floyd", note: "宇宙的スケールの音響実験。後にプログレの頂点へと進化する。",
        songs: [{ t: "Interstellar Overdrive", q: "Pink Floyd Interstellar Overdrive", sp: "3xyTufSSGLP3oZnomceAVW" }, { t: "See Emily Play", q: "Pink Floyd See Emily Play", sp: "1YZuigG1YcdgbfD7XJoCU5" }] },
      { name: "The Doors", note: "ジム・モリソンの詩的・呪術的なカリスマ。暗い官能とオルガンの音。",
        songs: [{ t: "Light My Fire", q: "The Doors Light My Fire", sp: "5uvosCdMlFdTXhoazkTI5R" }, { t: "Break On Through", q: "The Doors Break On Through", sp: "6OH7N2Q8SRVU3bCIVkoI6i" }] },
      { name: "Jefferson Airplane", note: "サンフランシスコ・サウンドの旗手。グレイス・スリックの声が幻覚を歌う。",
        songs: [{ t: "White Rabbit", q: "Jefferson Airplane White Rabbit", sp: "4vpeKl0vMGdAXpZiQB2Dtd" }, { t: "Somebody to Love", q: "Jefferson Airplane Somebody to Love", sp: "4uGIJG1jYFonGc4LGp5uQL" }] },
    ],
  },

  /* ---------------- 1970s ---------------- */
  {
    id: "hard_rock",
    name: "ハードロック",
    en: "Hard Rock",
    gen: 4, x: 0.18, years: "1969–1979",
    parents: ["blues_rock", "psychedelic"],
    hue: 20,
    tagline: "ブルースを増幅し、スタジアムを満たす轟音へ。",
    interpretation:
      "ヘヴィメタルとの境界は曖昧で、しばしば同義に使われる。一般にハードロックはブルースの躍動を残し、メタルはそれを削ぎ落として様式化した、と区別される。レッド・ツェッペリンを『ハードロックの完成』とみるか『メタルの起源』とみるかは論者次第だ。",
    sound:
      "大音量の歪んだリフ、力強いバックビート、ブルース由来のペンタトニック・ソロ、シャウトするボーカル。楽曲は太く、ライヴでの爆発力を重視する。",
    visual:
      "革とデニム、長髪、巨大なアンプの壁、スタジアムの照明。マチズモとロックスターの神話が最も肥大した姿。",
    era: "1969年前後に確立し70年代を支配。パンクに『恐竜』と揶揄されるが、80年代のグラムメタルへ命脈をつなぐ。",
    artists: [
      { name: "Led Zeppelin", note: "重さ・神秘・ブルースを融合した究極のロックバンド。以後の全ハードロックの基準。",
        songs: [{ t: "Whole Lotta Love", q: "Led Zeppelin Whole Lotta Love", sp: "0hCB0YR03f6AmQaHbwWDe8" }, { t: "Immigrant Song", q: "Led Zeppelin Immigrant Song", sp: "78lgmZwycJ3nzsdgmPPGNx" }] },
      { name: "Deep Purple", note: "オルガンとギターの対決、様式美と速さでハードロックを様式化。",
        songs: [{ t: "Smoke on the Water", q: "Deep Purple Smoke on the Water", sp: "5SAUIWdZ04OxYfJFDchC7S" }, { t: "Highway Star", q: "Deep Purple Highway Star", sp: "4gVTozEmzwAUXpwj3jEetX" }] },
      { name: "AC/DC", note: "余計なものを全て削ぎ落とした、純粋なロックンロールの権化。",
        songs: [{ t: "Back in Black", q: "AC/DC Back in Black", sp: "08mG3Y1vljYA6bvDt4Wqkj" }, { t: "Highway to Hell", q: "AC/DC Highway to Hell", sp: "2zYzyRzz6pRmhPzyfMEC8s" }] },
    ],
  },
  {
    id: "prog",
    name: "プログレッシブ・ロック",
    en: "Progressive Rock",
    gen: 4, x: 0.44, years: "1969–1977",
    parents: ["psychedelic", "folk_rock"],
    hue: 265,
    tagline: "ロックはどこまで複雑になれるか、という壮大な問い。",
    interpretation:
      "『ロックの芸術的野心の極致』と讃える者と、『大衆性を失った衒学的な自己満足』と切り捨てる者に真っ二つ。パンクが最も敵視した対象であり、その反動の大きさがプログレの達成の大きさを逆説的に証明している。",
    sound:
      "クラシックやジャズの理論、変拍子、長大な組曲、コンセプト・アルバム、メロトロンやシンセの荘厳な音色。超絶技巧と構築美を志向する。",
    visual:
      "ロジャー・ディーンらによる幻想的・SF的なアルバムアート、演劇的な舞台装置、幻想文学。知的で荘厳、時に大仰な世界観。",
    era: "1969〜77年に隆盛。パンクの登場で『時代遅れ』の烙印を押されるが、様式はメタルやポストロックへ受け継がれる。",
    artists: [
      { name: "King Crimson", note: "『クリムゾン・キングの宮殿』でプログレの扉を開いた。緊張と即興の巨人。",
        songs: [{ t: "21st Century Schizoid Man", q: "King Crimson 21st Century Schizoid Man", sp: "5yClziwiwTdqRmdPQl3NDz" }, { t: "The Court of the Crimson King", q: "King Crimson The Court of the Crimson King", sp: "1OFjv0Cq2JeK3FPvPG98rJ" }] },
      { name: "Yes", note: "多層的なコーラスと超絶技巧による構築美の極致。",
        songs: [{ t: "Roundabout", q: "Yes Roundabout", sp: "7lPjS6Yd4lRk4BsboDsm1H" }, { t: "Owner of a Lonely Heart", q: "Yes Owner of a Lonely Heart", sp: "0GTK6TesV108Jj5D3MHsYb" }] },
      { name: "Pink Floyd", note: "サイケから進化し、『狂気』で内省的コンセプト・アルバムを完成させた。",
        songs: [{ t: "Money", q: "Pink Floyd Money", sp: "61rfQ3Kqj4NeYCCJHNt7qj" }, { t: "Time", q: "Pink Floyd Time", sp: "3TO7bbrUKrOSPGRTB5MeCz" }] },
    ],
  },
  {
    id: "glam",
    name: "グラム・ロック",
    en: "Glam Rock",
    gen: 4, x: 0.68, years: "1971–1975",
    parents: ["psychedelic", "rocknroll"],
    hue: 320,
    tagline: "男でも女でもない星の使者。虚構という真実。",
    interpretation:
      "ラメと化粧、両性具有の美学。単なる派手な見た目とみなされがちだが、『自然/本物』を至上とするロックの価値観に対し『人工/虚構こそ表現だ』と突きつけた思想的挑戦でもあった。ボウイの『ジギー・スターダスト』はペルソナ(役柄)の概念をロックに導入した。",
    sound:
      "キャッチーなロックンロールのリフに、演劇性とデカダンスをまぶす。英国はアート志向(ボウイ)、米国はより享楽的(NYドールズ)。ストンプするビートと大合唱。",
    visual:
      "ラメ、化粧、厚底ブーツ、両性具有、宇宙的コスチューム。ロックにおける『ジェンダーの遊戯』とキャンプ(過剰な人工性)の美学の起点。",
    era: "1971〜75年に英国で隆盛。パンクとニューウェイヴ、そしてグラムメタルへ美学を受け渡す。",
    artists: [
      { name: "David Bowie", note: "変身を繰り返す『カメレオン』。ロックに演劇性と知性を注いだ20世紀の巨人。",
        songs: [{ t: "Ziggy Stardust", q: "David Bowie Ziggy Stardust", sp: "0NwGSYFvpiQ0ydLY3jRWSA" }, { t: "Starman", q: "David Bowie Starman", sp: "43XNrgulBg9wQA7vJiJRHM" }] },
      { name: "T. Rex", note: "マーク・ボランのブギーとグリッター。英国グラムの火付け役。",
        songs: [{ t: "Get It On", q: "T. Rex Get It On", sp: "6bDDM0rFFnGaUD47T4kpcO" }, { t: "20th Century Boy", q: "T. Rex 20th Century Boy", sp: "6Soku1wiB6mfcQp2s2W6a6" }] },
    ],
  },
  {
    id: "krautrock",
    name: "クラウトロック",
    en: "Krautrock",
    gen: 4, x: 0.90, years: "1970–1977",
    parents: ["psychedelic"],
    hue: 170,
    tagline: "ドイツの若者が、反復の中に未来を見た。",
    interpretation:
      "英国のジャーナリズムが付けた蔑称的な呼び名で、当事者は嫌う者も多い(『コズミッシェ・ムジーク』とも)。戦後ドイツの若者が、米英のブルース由来のロックを拒絶し、ゼロから独自の音楽を作ろうとした運動。反復とテクノロジーへの志向は、後のポストパンク・電子音楽の母胎になった。",
    sound:
      "『モトリック』と呼ばれる機械的で均一な反復ビート、シンセサイザーとテープ操作、ブルース進行の排除、長い催眠的な展開。",
    visual:
      "無機質でミニマル、工業的、反ロックスター的な匿名性。感情の誇示ではなく、システムとテクスチャーの美学。",
    era: "1970年代前半に隆盛。デヴィッド・ボウイのベルリン三部作を経て、ニューウェイヴ/インダストリアル/テクノへ絶大な影響を残す。",
    artists: [
      { name: "Can", note: "即興と編集で作る反復の魔術。ポストパンク以降が繰り返し掘り起こす源泉。",
        songs: [{ t: "Vitamin C", q: "Can Vitamin C", sp: "4zdsBics0asw0gj4L5wu5v" }, { t: "Halleluhwah", q: "Can Halleluhwah", sp: "4tdEmE39Z4OKqTaP7lwQ3u" }] },
      { name: "Neu!", note: "モトリック・ビートを純化。以後のあらゆる反復音楽の設計図。",
        songs: [{ t: "Hallogallo", q: "Neu! Hallogallo", sp: "1GkZZHT9uJjdzrrksrpczR" }] },
    ],
  },
  {
    id: "punk",
    name: "パンク・ロック",
    en: "Punk Rock",
    gen: 5, x: 0.70, years: "1976–1979",
    parents: ["garage", "glam"],
    hue: 350,
    tagline: "3コードあれば十分だ。技術より態度、洗練より衝動。",
    interpretation:
      "『どこで生まれたか』が最大の論点。ニューヨーク(CBGB/芸術的・多様)が先か、ロンドン(政治的・ファッション的)が本流かで英米が対立する。マルコム・マクラーレンによる仕掛け(セックス・ピストルズ)を重視すれば、パンクは『反商業』を装った商業戦略でもあった。だがそれ以上に、パンクは『誰でも表現していい』という音楽の民主化宣言だった。",
    sound:
      "速く短い曲、単純な3コード、歪んだギターの高速ダウンピッキング、叫ぶボーカル、ソロの拒否。技巧と長尺を敵視し、生々しさとスピードを最上とする。",
    visual:
      "破れたTシャツ、安全ピン、モヒカン、スタッズ、DIYのコラージュ。既存の美意識と権威への攻撃を身体化したアンチ・ファッション。",
    era: "1976〜79年に爆発し、既存のロックを一掃した。すぐにポストパンク/ハードコア/ニューウェイヴへ多様に分裂する。",
    artists: [
      { name: "Ramones", note: "全曲2分・高速3コード。パンクの設計図そのものを作ったNYの兄弟分。",
        songs: [{ t: "Blitzkrieg Bop", q: "Ramones Blitzkrieg Bop", sp: "7sYW1cE2sjVFMRVV73R8TA" }, { t: "Judy Is a Punk", q: "Ramones Judy Is a Punk", sp: "2OVGtm7PQ4uu7YN5BKLzEk" }] },
      { name: "Sex Pistols", note: "『No Future』。英国社会への挑発で、パンクを世界的事件に変えた。",
        songs: [{ t: "Anarchy in the U.K.", q: "Sex Pistols Anarchy in the UK", sp: "5moTxUGPZXgGmosl4rIELm" }, { t: "God Save the Queen", q: "Sex Pistols God Save the Queen", sp: "6ui6l3ZNvlrGQZArwo8195" }] },
      { name: "The Clash", note: "レゲエやファンクを取り込み、パンクに知性と射程を与えた『唯一無二のバンド』。",
        songs: [{ t: "London Calling", q: "The Clash London Calling", sp: "124Y9LPRCAz3q2OP0iCvcJ" }, { t: "Should I Stay or Should I Go", q: "The Clash Should I Stay or Should I Go", sp: "0M4MUFxufVAmuauXvuULbs" }] },
    ],
  },
  {
    id: "heavy_metal",
    name: "ヘヴィメタル",
    en: "Heavy Metal",
    gen: 5, x: 0.14, years: "1970–1983",
    parents: ["hard_rock", "blues_rock"],
    hue: 230,
    tagline: "重く、暗く、様式化された鋼鉄の轟音。",
    interpretation:
      "起源はブラック・サバス(工業都市バーミンガムの陰鬱)にほぼ一致するが、レッド・ツェッペリンやディープ・パープルを含めるかで境界が揺れる。ハードロックから『ブルースの躍動』を抜き、暗さ・重さ・威圧を様式化したものと理解される。以後、無数のサブジャンルへ爆発的に分化する最も繁茂した系統。",
    sound:
      "ダウンチューニングした重厚なギターリフ、パワーコード、ツーバスのドラム、劇的な構成。歌詞は戦争・死・神話・ファンタジー・社会批判など重厚なテーマを好む。",
    visual:
      "黒い革、鋲、ロゴの様式美、ドクロや悪魔などのダークなアートワーク。部族的な一体感と、社会からの疎外を誇りに変える美学。",
    era: "1970年に萌芽、70年代末のNWOBHMで再点火。80年代以降、スラッシュ/デス/ブラック/パワー等へ無限に枝分かれする。",
    artists: [
      { name: "Black Sabbath", note: "重さ・暗さ・不吉さを発明したヘヴィメタルの真の始祖。",
        songs: [{ t: "Paranoid", q: "Black Sabbath Paranoid", sp: "3L8WgDYS5TtwbyxOPSAiFf" }, { t: "Iron Man", q: "Black Sabbath Iron Man", sp: "4svkPL62HbvyFgf0nHFXAF" }] },
      { name: "Judas Priest", note: "ブルースを排し、革と鋲のヴィジュアルとツインギターでメタルを様式化。",
        songs: [{ t: "Breaking the Law", q: "Judas Priest Breaking the Law", sp: "2RaA6kIcvomt77qlIgGhCT" }, { t: "Painkiller", q: "Judas Priest Painkiller", sp: "0L7zm6afBEtrNKo6C6Gj08" }] },
    ],
  },

  /* ---------------- late 70s / 80s ---------------- */
  {
    id: "post_punk",
    name: "ポストパンク",
    en: "Post-Punk",
    gen: 6, x: 0.52, years: "1978–1984",
    parents: ["punk", "krautrock"],
    hue: 240,
    tagline: "パンクの自由で、パンク以外の全てを試す。",
    interpretation:
      "『パンクの後に来たもの』という消極的な定義しかできないほど多様。パンクが破壊した更地に、ダブ・ファンク・クラウトロック・現代美術を持ち込み再構築した知的な運動。しばしば最も創造的なロックの時代とされ、その広がりゆえに単一ジャンルと呼べるか自体が問われる。",
    sound:
      "角張った不協和なギター、前に出る反復的ベース、隙間の多いミニマルな構造、実験的な録音、冷たく内省的な雰囲気。パンクの速さより空間と質感を重視する。",
    visual:
      "モノクロームで禁欲的、インダストリアルな都市の陰鬱、モダニズム的デザイン(ファクトリー/ペーター・サヴィル)。知的で疎外された美学。",
    era: "1978〜84年に隆盛。ゴシック/ニューウェイヴ/インダストリアル、そして90年代以降のオルタナ全般の設計図になった。",
    artists: [
      { name: "Joy Division", note: "イアン・カーティスの絶望を刻んだ、暗く広大な音響。ポストパンクの魂。",
        songs: [{ t: "Love Will Tear Us Apart", q: "Joy Division Love Will Tear Us Apart", sp: "2JO3HwMRPeya8bXbtbyPcf" }, { t: "Disorder", q: "Joy Division Disorder", sp: "2WEw8oFZiANQzWdGElO3Mf" }] },
      { name: "Gang of Four", note: "ファンクのグルーヴと political な鋭さ。踊れる知性の原型。",
        songs: [{ t: "Damaged Goods", q: "Gang of Four Damaged Goods", sp: "62uw0iWu8jLB4cYBQxjdcm" }, { t: "At Home He's a Tourist", q: "Gang of Four At Home He's a Tourist", sp: "1fpSdqEoXJBEr4HGQhWcxP" }] },
      { name: "Wire", note: "パンクを最短で解体し再構築した、簡潔で前衛的な発明家たち。",
        songs: [{ t: "Ex Lion Tamer", q: "Wire Ex Lion Tamer", sp: "6JK4rRp3HbsfgjKdVvMF2c" }, { t: "Outdoor Miner", q: "Wire Outdoor Miner", sp: "4G7OQA5GNOKGlCQhTCBgDm" }] },
    ],
  },
  {
    id: "new_wave",
    name: "ニューウェイヴ",
    en: "New Wave",
    gen: 6, x: 0.76, years: "1978–1985",
    parents: ["punk", "glam"],
    hue: 190,
    tagline: "パンクのエネルギーを、ポップとシンセに乗せて。",
    interpretation:
      "当初はパンクの商業的な言い換えに近かったが、次第にシンセを取り入れたキャッチーなポップ全般を指すようになった。ポストパンクとの境界は極めて曖昧で、『暗く実験的ならポストパンク、明るくポップならニューウェイヴ』と便宜的に区別されることが多い。MTV時代の申し子。",
    sound:
      "シンセサイザー、跳ねるダンサブルなビート、明快なメロディ、洗練されたポップ感覚。パンクの衝動を、より聴きやすく色彩的に整えたもの。",
    visual:
      "カラフルで未来的、奇抜なヘアスタイル、アート・スクール的なセンス。MTVの映像時代に最適化されたスタイリッシュな美学。",
    era: "1978〜85年に隆盛。MTVの主役となり、シンセポップやオルタナ・ポップへ流れ込む。",
    artists: [
      { name: "Talking Heads", note: "アフロ・ファンクと知性を融合した、ニューウェイヴ最高の頭脳。",
        songs: [{ t: "Once in a Lifetime", q: "Talking Heads Once in a Lifetime", sp: "1XRPhfz1e4g203fCrjztLp" }, { t: "Psycho Killer", q: "Talking Heads Psycho Killer", sp: "7dSCxR4LqkmxoBrq9MzVSD" }] },
      { name: "Blondie", note: "パンク、ディスコ、ラップを飲み込んだNYの女王。",
        songs: [{ t: "Heart of Glass", q: "Blondie Heart of Glass", sp: "4v2rkl1mC3zVAz0nXMx9r4" }, { t: "Call Me", q: "Blondie Call Me", sp: "7HKxTNVlkHsfMLhigmhC0I" }] },
    ],
  },
  {
    id: "hardcore_punk",
    name: "ハードコア・パンク",
    en: "Hardcore Punk",
    gen: 6, x: 0.92, years: "1980–1986",
    parents: ["punk"],
    hue: 5,
    tagline: "もっと速く、もっと硬く、もっと純粋に。",
    interpretation:
      "パンクが商業化・ファッション化したことへの反動として、米国郊外の若者が生んだ『パンクのパンク』。ワシントンDCのストレート・エッジ(禁酒禁煙・非暴力の禁欲思想)に代表される、音楽を超えた生き方・コミュニティ運動でもあった。",
    sound:
      "極端に速く短い曲(1分未満も)、絶叫、剥き出しの怒り、装飾の一切ない攻撃性。メロディよりスピードと強度を優先する。",
    visual:
      "丸刈りやモヒカン、モッシュとダイヴ、DIYの自主レーベルとジン。徹底したアンダーグラウンド倫理。",
    era: "1980〜86年に米国各地で隆盛。スラッシュメタル、グランジ、エモ、メタルコアなど後続の多くを準備した。",
    artists: [
      { name: "Black Flag", note: "米国西海岸ハードコアの中心。DIYツアーで地下ネットワークを築いた。",
        songs: [{ t: "Rise Above", q: "Black Flag Rise Above", sp: "4kFfFe38CRVnTsakUTL4E4" }, { t: "Nervous Breakdown", q: "Black Flag Nervous Breakdown", sp: "3NoOwvxhI2yMYknxqnFUVx" }] },
      { name: "Minor Threat", note: "ストレート・エッジの発明者。純粋主義的な怒りと倫理の象徴。",
        songs: [{ t: "Straight Edge", q: "Minor Threat Straight Edge", sp: "3Iw6tbCYDYb3libUo3bB5S" }, { t: "Minor Threat", q: "Minor Threat Minor Threat song", sp: "6yIaRcvzhIrukxS4VVhil0" }] },
    ],
  },
  {
    id: "nwobhm",
    name: "NWOBHM",
    en: "New Wave of British Heavy Metal",
    gen: 6, x: 0.12, years: "1979–1983",
    parents: ["heavy_metal"],
    hue: 220,
    tagline: "パンクの速さを、メタルの様式で鍛え直す。",
    interpretation:
      "『新・英国ヘヴィメタルの波』。70年代末、パンクのDIY精神とスピードを吸収しつつ、メタルの技巧と様式美を再興した運動。しばしば見過ごされるが、これがなければスラッシュメタルは生まれなかった、メタル史の要の結節点。",
    sound:
      "ツインギターのハーモニーと疾走感、パンク由来のスピード感、叙事詩的な歌詞、超絶技巧。より速く、よりメロディックに。",
    visual:
      "革とスタッズ、ファンタジーやSFのアートワーク、マスコット・キャラクター(アイアン・メイデンの『エディ』)。",
    era: "1979〜83年に英国で隆盛。米国の若者に飛び火し、スラッシュメタル爆発の直接の引き金になった。",
    artists: [
      { name: "Iron Maiden", note: "ツインリードと叙事詩でメタルの新基準を作り、今も世界を席巻する。",
        songs: [{ t: "The Trooper", q: "Iron Maiden The Trooper", sp: "2WeSz9FLWE9RRIFDWtD5nc" }, { t: "Run to the Hills", q: "Iron Maiden Run to the Hills", sp: "44AxeBXrK9LQlGjXyT2oZQ" }] },
      { name: "Motörhead", note: "パンクとメタルの境界を消し去った、爆音とスピードの権化。",
        songs: [{ t: "Ace of Spades", q: "Motörhead Ace of Spades", sp: "6EPRKhUOdiFSQwGBRBbvsZ" }] },
    ],
  },
  {
    id: "goth_rock",
    name: "ゴシック・ロック",
    en: "Gothic Rock",
    gen: 7, x: 0.50, years: "1981–1989",
    parents: ["post_punk"],
    hue: 285,
    tagline: "闇と耽美。死と官能を歌う黒い薔薇。",
    interpretation:
      "ポストパンクの陰鬱を極端化した一派。『ゴシック』は当初批評用語で、当事者バンドの多くは呼称を嫌った。音楽ジャンルであると同時に、文学・映画・ファッションを横断する巨大なサブカルチャー(ゴス)を生んだ点が特異。",
    sound:
      "コーラス/フランジャーで揺らぐギター、うねる低音ベース、ドラムマシンや荘厳なリズム、バリトンの憂鬱なボーカル。死・愛・宗教・退廃をロマンティックに歌う。",
    visual:
      "黒ずくめ、白塗り、逆立てた黒髪、ヴィクトリアン、墓地と蝙蝠。19世紀のゴシック文学とデカダンスを甦らせた耽美主義。",
    era: "1981〜89年に隆盛。以後もサブカルチャーとして生き続け、インダストリアルやメタルにも美学を供給した。",
    artists: [
      { name: "Bauhaus", note: "『Bela Lugosi's Dead』でゴシックの美学を発明した始祖。",
        songs: [{ t: "Bela Lugosi's Dead", q: "Bauhaus Bela Lugosi's Dead", sp: "5EhI8pJIJzUDnTlCLr3kL9" }] },
      { name: "The Cure", note: "憂鬱と多幸感を往復する、ゴスを超えて愛される永遠のアウトサイダー。",
        songs: [{ t: "A Forest", q: "The Cure A Forest", sp: "0o4S13NJiEdnzy67ZKoyFZ" }, { t: "Just Like Heaven", q: "The Cure Just Like Heaven", sp: "76GlO5H5RT6g7y0gev86Nk" }] },
      { name: "Siouxsie and the Banshees", note: "氷のような気高さでポストパンクとゴスを繋いだ女王。",
        songs: [{ t: "Spellbound", q: "Siouxsie and the Banshees Spellbound", sp: "5Ng6UbryNd3eds2zQk9MUf" }, { t: "Cities in Dust", q: "Siouxsie and the Banshees Cities in Dust", sp: "2xq9cLlOPyLoi8kLlR4miz" }] },
    ],
  },
  {
    id: "synth_pop",
    name: "シンセポップ",
    en: "Synth-pop",
    gen: 7, x: 0.80, years: "1980–1987",
    parents: ["new_wave", "krautrock"],
    hue: 175,
    tagline: "ギターを捨て、未来の音で心を歌う。",
    interpretation:
      "『これはロックか?』という問いを最も鋭く突きつけるジャンル。ギターを排しシンセとドラムマシンだけで構成する点で、ロックの伝統(生演奏・肉体性)から最も遠い。だがパンク/ニューウェイヴの子であり、テクノロジーで感情を表現する系譜として、広義のロック史に組み込まれる。",
    sound:
      "アナログ/デジタル・シンセの分厚い音色、ドラムマシンの正確なビート、キャッチーで憂いを帯びたメロディ。人工的な音で、しばしば孤独や疎外を歌う。",
    visual:
      "無機質でスタイリッシュ、未来主義、抑制されたクールネス。ロックスターの汗と対照的な、洗練された都会的イメージ。",
    era: "1980〜87年に隆盛。クラウトロックとディスコを土台に、後のエレクトロニカやシンセウェイヴへつながる。",
    artists: [
      { name: "Depeche Mode", note: "ポップから暗く官能的な巨大バンドへ変貌。シンセで『重さ』を表現した。",
        songs: [{ t: "Enjoy the Silence", q: "Depeche Mode Enjoy the Silence", sp: "6WK9dVrRABMkUXFLNlgWFh" }, { t: "Personal Jesus", q: "Depeche Mode Personal Jesus", sp: "2wUlYDGGXlSvm2NkGj0Qio" }] },
      { name: "New Order", note: "ジョイ・ディヴィジョンの残党が、悲しみをダンスフロアへ翻訳した。",
        songs: [{ t: "Blue Monday", q: "New Order Blue Monday", sp: "6hHc7Pks7wtBIW8Z6A0iFq" }, { t: "Bizarre Love Triangle", q: "New Order Bizarre Love Triangle", sp: "6wVViUl2xSRoDK2T7dMZbR" }] },
    ],
  },
  {
    id: "college_alt",
    name: "カレッジ / オルタナティヴ・ロック",
    en: "College / Alternative Rock",
    gen: 7, x: 0.64, years: "1983–1991",
    parents: ["post_punk", "folk_rock"],
    hue: 100,
    tagline: "メインストリームの外側で育った、もう一つの本流。",
    interpretation:
      "『オルタナティヴ(=代替)』とは何に対する代替か——商業的な産業ロックに対して、という定義自体が、後にオルタナが主流化することで無意味になる皮肉を抱える。80年代は大学ラジオを拠点とする地下の総称(カレッジ・ロック)で、ジャンルというより『態度』や『流通経路』を指した。",
    sound:
      "多様だが共通するのは、きらめくジャングリーなギター(ジャングル・ポップ)、内省的な歌詞、ポップとアンダーグラウンドのバランス。過剰な技巧やマチズモを避ける美意識。",
    visual:
      "フランネルシャツと古着、飾らない『普通さ』、独立系レーベルとジン。反・スタジアム、反・グラマラスの等身大の美学。",
    era: "1983〜91年に地下で成熟。ニルヴァーナの成功で『オルタナ』が世界の主流となる瞬間へ向かう。",
    artists: [
      { name: "R.E.M.", note: "ジャングリーなギターと難解な歌詞で、地下から世界的バンドへ登り詰めた道標。",
        songs: [{ t: "Losing My Religion", q: "R.E.M. Losing My Religion", sp: "31AOj9sFz2gM0O3hMARRBx" }, { t: "The One I Love", q: "R.E.M. The One I Love", sp: "2fdfsGuqb6SBX5ocoBWHUd" }] },
      { name: "Pixies", note: "静と動を交互に爆発させる構造で、ニルヴァーナら次世代を決定づけた。",
        songs: [{ t: "Where Is My Mind?", q: "Pixies Where Is My Mind", sp: "6mcxQ1Y3uQRU0IHsvdNLH1" }, { t: "Debaser", q: "Pixies Debaser", sp: "3FzKPS0oVknVlCW3PhxIHl" }] },
    ],
  },
  {
    id: "thrash_metal",
    name: "スラッシュメタル",
    en: "Thrash Metal",
    gen: 7, x: 0.10, years: "1983–1991",
    parents: ["nwobhm", "hardcore_punk"],
    hue: 245,
    tagline: "NWOBHMの技巧とハードコアの速度が交わる臨界点。",
    interpretation:
      "英国メタルの様式美と、米国ハードコアの速さ・攻撃性の交配種。『Big 4』(メタリカ/メガデス/スレイヤー/アンスラックス)を中心とするが、メタリカの後の商業的変貌を『裏切り』とみるかで、コミュニティの評価は今も割れる。",
    sound:
      "高速のダウンピッキング・リフ、複雑な曲構成、鋭く刻むリズム、社会批判や戦争・恐怖を扱う歌詞。テクニックとスピードの両立。",
    visual:
      "デニムと革、逆さ十字やドクロ、戦争や核をモチーフにしたアートワーク。享楽的なグラムメタルへの対抗としての『硬派さ』。",
    era: "1983〜91年に隆盛。デスメタル/ブラックメタルなどエクストリーム・メタルの母胎となり、グルーヴメタルへも展開する。",
    artists: [
      { name: "Metallica", note: "スラッシュを世界的現象に押し上げ、メタルの歴史を書き換えた最大の存在。",
        songs: [{ t: "Master of Puppets", q: "Metallica Master of Puppets", sp: "2MuWTIM3b0YEAskbeeFE1i" }, { t: "Enter Sandman", q: "Metallica Enter Sandman", sp: "5BIMPccDwShpXq784RJlJp" }] },
      { name: "Slayer", note: "最も速く最も邪悪。エクストリーム・メタルの限界を押し広げた。",
        songs: [{ t: "Raining Blood", q: "Slayer Raining Blood", sp: "01Mpj13vURSO3cCLprPt5T" }, { t: "Angel of Death", q: "Slayer Angel of Death", sp: "61dTqhd46yMkSWmC5LAh5F" }] },
    ],
  },
  {
    id: "glam_metal",
    name: "グラムメタル",
    en: "Glam Metal / Hair Metal",
    gen: 7, x: 0.26, years: "1983–1991",
    parents: ["glam", "heavy_metal"],
    hue: 330,
    tagline: "享楽・化粧・スタジアム。80年代のサンセット大通り。",
    interpretation:
      "『ヘアメタル』は多分に蔑称。グラムの派手なビジュアルとハードロックのキャッチーさを結合した、80年代MTV全盛の商業的絶頂。ゆえにグランジ登場後は『空虚な産業ロックの象徴』として最も激しく否定された——が、近年は楽曲の完成度が再評価されつつある。",
    sound:
      "キャッチーなリフとポップな大合唱コーラス、バラード(パワーバラード)、超絶ギターソロ。享楽・恋愛・パーティを歌う。",
    visual:
      "逆立てた長髪(ビッグヘア)、スパンデックス、化粧、ロサンゼルスの退廃と華やかさ。過剰なゴージャスさの美学。",
    era: "1983〜91年にMTVを席巻。1991年、ニルヴァーナの登場で一夜にして時代遅れとなった、と語られる。",
    artists: [
      { name: "Mötley Crüe", note: "退廃と享楽の権化。サンセット・ストリップのグラムメタルを象徴。",
        songs: [{ t: "Kickstart My Heart", q: "Mötley Crüe Kickstart My Heart", sp: "7GonnnalI2s19OCQO1J7Tf" }, { t: "Girls, Girls, Girls", q: "Mötley Crüe Girls Girls Girls", sp: "3439OLNIeD3y68kVuoZUO5" }] },
      { name: "Guns N' Roses", note: "グラムの享楽に危険な本物のロックンロールを注ぎ、時代の頂点に立った。",
        songs: [{ t: "Sweet Child o' Mine", q: "Guns N' Roses Sweet Child o' Mine", sp: "7snQQk1zcKl8gZ92AnueZW" }, { t: "Welcome to the Jungle", q: "Guns N' Roses Welcome to the Jungle", sp: "0G21yYKMZoHa30cYVi1iA8" }] },
    ],
  },
  {
    id: "industrial_rock",
    name: "インダストリアル・ロック",
    en: "Industrial Rock",
    gen: 7, x: 0.94, years: "1988–1999",
    parents: ["post_punk", "krautrock"],
    hue: 210,
    tagline: "機械の軋みと肉体の苦痛を、暴力的な音塊へ。",
    interpretation:
      "実験的・非音楽的なインダストリアル(スロッビング・グリッスル等)を、ギターとロックの構造に接続して大衆化したもの。『ロックと電子音楽の暴力的な結婚』であり、90年代にはメインストリームでも大きな成功を収めた。",
    sound:
      "サンプリングとノイズ、機械的で硬質なビート、歪んだギターとシンセ、加工された攻撃的なボーカル。疎外・支配・痛みを主題にする。",
    visual:
      "工場・廃墟・機械、退廃と暴力のイメージ、モノクロームと金属。テクノロジーに疎外された身体の悪夢。",
    era: "1988〜99年に隆盛。メタルやエレクトロニカと交わり、後のニューメタルの一因子にもなった。",
    artists: [
      { name: "Nine Inch Nails", note: "トレント・レズナーの内面の痛みを、精緻なノイズの大作へ昇華した。",
        songs: [{ t: "Closer", q: "Nine Inch Nails Closer", sp: "2oDqmfa2g8W893LlwJG1qu" }, { t: "Head Like a Hole", q: "Nine Inch Nails Head Like a Hole", sp: "3ckd4YA4LcD3j50rfIVwUe" }] },
      { name: "Ministry", note: "スラッシュメタルの速度とサンプリングで、インダストリアルを暴力化した。",
        songs: [{ t: "Jesus Built My Hotrod", q: "Ministry Jesus Built My Hotrod", sp: "0BX3ysoHJvxmLEhPMAfb2z" }] },
    ],
  },

  /* ---------------- 1990s ---------------- */
  {
    id: "grunge",
    name: "グランジ",
    en: "Grunge",
    gen: 8, x: 0.36, years: "1989–1996",
    parents: ["hardcore_punk", "heavy_metal", "college_alt"],
    hue: 130,
    tagline: "汚れて、気だるく、正直に。反抗の仕方を見失った世代の声。",
    interpretation:
      "パンクの怒りとメタルの重さを、オルタナの内省で溶かした音。シアトルという土地とサブ・ポップというレーベルの物語が強調されるが、当事者(特にカート・コバーン)は『グランジ』という商業的レッテルとロックスター化を最も嫌悪した。その拒否と自己破壊こそがグランジの核でもある。",
    sound:
      "歪んだ重いギター、静と動のダイナミクス(ピクシーズ由来)、気だるくも激情的なボーカル、自己嫌悪・疎外・無気力を歌う歌詞。",
    visual:
      "フランネルシャツ、破れたジーンズ、無精髭、意図的な『反ファッション』。80年代の華美さを全否定する、疲れて飾らない等身大。",
    era: "1991年『ネヴァーマインド』の爆発でオルタナが世界の中心へ。94年のコバーンの死が、その熱狂に象徴的な終止符を打った。",
    artists: [
      { name: "Nirvana", note: "地下の価値観を世界の頂点へ運び、ロックの勢力図を一夜で塗り替えた。",
        songs: [{ t: "Smells Like Teen Spirit", q: "Nirvana Smells Like Teen Spirit", sp: "5ghIJDpPoe3CfHMGu71E6T" }, { t: "Come as You Are", q: "Nirvana Come as You Are", sp: "4P5KoWXOxwuobLmHXLMobV" }] },
      { name: "Pearl Jam", note: "クラシック・ロックの重厚さと誠実さで、グランジを長く生き延びさせた。",
        songs: [{ t: "Alive", q: "Pearl Jam Alive", sp: "1L94M3KIu7QluZe63g64rv" }, { t: "Even Flow", q: "Pearl Jam Even Flow", sp: "6QewNVIDKdSl8Y3ycuHIei" }] },
      { name: "Soundgarden", note: "サバス直系の重さと変拍子で、グランジに暗い荘厳さを与えた。",
        songs: [{ t: "Black Hole Sun", q: "Soundgarden Black Hole Sun", sp: "2EoOZnxNgtmZaD8uUmz2nD" }, { t: "Spoonman", q: "Soundgarden Spoonman", sp: "1jMaB19DiVR8OihLSuYFOt" }] },
    ],
  },
  {
    id: "shoegaze",
    name: "シューゲイズ",
    en: "Shoegaze",
    gen: 8, x: 0.57, years: "1990–1995",
    parents: ["post_punk", "college_alt"],
    hue: 290,
    tagline: "轟音のノイズに溶ける、甘く曖昧な夢。",
    interpretation:
      "『靴を見つめる』——エフェクターを操作するため下を向いて演奏する内気な姿を英国メディアが揶揄した呼称。当初は蔑称だったが、後に最も愛される美学の一つになった。ノイズと甘美なメロディの逆説的な融合が本質。",
    sound:
      "何層にも重ねた歪みとリバーブの『音の壁』、埋もれるようにささやくボーカル、うねるトレモロ、旋律とノイズの境界の溶解。",
    visual:
      "ぼやけた写真、パステルと霞、内向的で控えめ、光の滲み。感情を直接叫ぶのではなく、霧の中に沈める美学。",
    era: "1990〜95年に英国で隆盛。ブリットポップの登場で一度は忘れられるが、2000年代以降に世界中で再評価・再興した。",
    artists: [
      { name: "My Bloody Valentine", note: "『Loveless』は音の壁の到達点。以後の轟音ギター全ての基準点。",
        songs: [{ t: "Only Shallow", q: "My Bloody Valentine Only Shallow", sp: "52UcjsM15hjCQAUbTW2hy1" }, { t: "Soon", q: "My Bloody Valentine Soon", sp: "7ITRNB9OckYIp2SW2iXU8U" }] },
      { name: "Slowdive", note: "ノイズより静謐と美を志向し、シューゲイズの叙情面を極めた。",
        songs: [{ t: "Alison", q: "Slowdive Alison", sp: "33HRECrmuelZxOpid6XTNX" }, { t: "When the Sun Hits", q: "Slowdive When the Sun Hits", sp: "0oxYB9GoOIDrdzniNdKC44" }] },
    ],
  },
  {
    id: "britpop",
    name: "ブリットポップ",
    en: "Britpop",
    gen: 8, x: 0.79, years: "1993–1999",
    parents: ["college_alt", "british_invasion"],
    hue: 45,
    tagline: "米国のグランジへの反撃。英国よ、もう一度輝け。",
    interpretation:
      "米国産グランジの陰鬱への反動として、英国のバンドが自国のギター・ポップの伝統(ビートルズ/キンクス/スミス)を誇らしく再興した運動。オアシスvsブラーの『バトル』はメディアの祭りであり、その愛国的・階級的な力学を含めて英国的な現象だった。",
    sound:
      "キャッチーなメロディとギター、英国的な歌詞と訛り、60年代ポップへの参照、スタジアム級の大合唱。明快で高揚感がある。",
    visual:
      "ユニオンジャック、モッズ回帰、労働者階級の日常、クール・ブリタニアの楽観。90年代半ばの英国の自信を体現した。",
    era: "1993〜99年に英国を席巻。過剰な期待とバンドの内紛、そして90年代末の失速とともに終息する。",
    artists: [
      { name: "Oasis", note: "労働者階級の傲慢さとアンセム。英国を熱狂させた最大のブリットポップ・バンド。",
        songs: [{ t: "Wonderwall", q: "Oasis Wonderwall", sp: "5wj4E6IsrVtn8IBJQOd0Cl" }, { t: "Don't Look Back in Anger", q: "Oasis Don't Look Back in Anger", sp: "7ppPZa3TRUSGKaks9wH7VT" }] },
      { name: "Blur", note: "英国社会を皮肉る知性と実験精神で、オアシスと対極を成した。",
        songs: [{ t: "Song 2", q: "Blur Song 2", sp: "4F64QXRV1EGHSm5jIeMmcQ" }, { t: "Girls & Boys", q: "Blur Girls and Boys", sp: "5CeL9C3bsoe4yzYS1Qz8cw" }] },
    ],
  },
  {
    id: "post_rock",
    name: "ポストロック",
    en: "Post-Rock",
    gen: 8, x: 0.68, years: "1994–2005",
    parents: ["post_punk", "prog"],
    hue: 160,
    tagline: "ロックの楽器で、ロックではない風景を描く。",
    interpretation:
      "『ロックの楽器編成を、ロックのリフやコーラスとは違う目的に使う音楽』とされる。歌もサビもない長尺のインスト展開ゆえ、『これはロックか、それとも室内楽か』という境界の問いを常に抱える。批評家サイモン・レイノルズの造語。",
    sound:
      "静かな導入から轟音へと build する長大なダイナミクス、反復と質感、歌詞の希薄さ、映画音楽的なスケール。感情を叙景として描く。",
    visual:
      "広大な風景、廃墟、抽象的で無人の映像、荘厳さと寂寥。ロックスターの不在、音そのものが主役。",
    era: "1994〜2005年に隆盛。以後もインディー/アンビエントと交わりながら世界中で静かに拡散し続けている。",
    artists: [
      { name: "Mogwai", note: "静寂と爆音の落差で感情を揺さぶる、ポストロックの代表格。",
        songs: [{ t: "Mogwai Fear Satan", q: "Mogwai Mogwai Fear Satan", sp: "1EvW7Sx1prPSpS06EoO7YG" }, { t: "Take Me Somewhere Nice", q: "Mogwai Take Me Somewhere Nice", sp: "3s2MZsEfiMe7ZjiRtun6wv" }] },
      { name: "Godspeed You! Black Emperor", note: "終末的スケールの大作。政治性と荘厳さでポストロックの極北を示した。",
        songs: [{ t: "The Dead Flag Blues", q: "Godspeed You Black Emperor The Dead Flag Blues", sp: "0YzMEu5sGNX0JKr9mdBtzd" }] },
    ],
  },
  {
    id: "extreme_metal",
    name: "デス / ブラックメタル",
    en: "Death / Black Metal",
    gen: 8, x: 0.05, years: "1990–1998",
    parents: ["thrash_metal"],
    hue: 255,
    tagline: "音楽が到達しうる、最も暗く極端な深淵。",
    interpretation:
      "スラッシュをさらに先鋭化した『エクストリーム・メタル』の総称。デスメタル(唸り声・技巧・グロテスク)とブラックメタル(絶叫・冷厳・反キリスト)は美学も思想も大きく異なる。特にノルウェジアン・ブラックメタルは教会放火・殺人など現実の犯罪に及び、音楽と過激思想の関係という重い問いを残した。",
    sound:
      "デス=低い唸り声(グロウル)・複雑な構成・ブラストビート。ブラック=甲高い絶叫・トレモロの冷たいギター・生々しく荒い録音(ロウ・ファイ)。",
    visual:
      "デス=グロテスクなアートワーク。ブラック=白黒のコープスペイント、森・冬・城、反宗教の象徴。共に非日常的で儀式的。",
    era: "1990年代前半に確立。以後、シンフォニック/メロディック等へ細分化しつつ世界中に深く根を張った。",
    artists: [
      { name: "Death", note: "チャック・シュルディナー主導。デスメタルを技巧的・知的な芸術へ高めた。",
        songs: [{ t: "Crystal Mountain", q: "Death Crystal Mountain", sp: "0ItAcLSkUiePOmFGun3cSe" }, { t: "Pull the Plug", q: "Death Pull the Plug", sp: "2l0h4aBFLp9HdoaNdCTlbW" }] },
      { name: "Mayhem", note: "ノルウェジアン・ブラックメタルの中心。音楽史上最も暗い神話を背負う。",
        songs: [{ t: "Freezing Moon", q: "Mayhem Freezing Moon", sp: "4AP3a7eEOlz5sTJiWnv2C6" }] },
    ],
  },
  {
    id: "emo",
    name: "エモ",
    en: "Emo",
    gen: 8, x: 0.46, years: "1985–2003",
    parents: ["hardcore_punk"],
    hue: 340,
    tagline: "怒りではなく、傷つきやすさを叫ぶハードコア。",
    interpretation:
      "『エモーショナル・ハードコア』が語源。80年代DCの実験的ハードコア(emocore)から、90年代のミッドウェスト・エモ、そして2000年代のメジャーなポップ・パンク寄りエモまで、指すものが世代で全く異なる。近年『エモ』は音楽を超えたファッション/感性の総称にもなり、定義は最も紛糾するジャンルの一つ。",
    sound:
      "静と動の激しい対比、告白的で内省的な歌詞、感情が決壊するようなボーカル、複雑なギターの絡み(ミッドウェスト・エモ)。",
    visual:
      "黒髪の斜め前髪、細身のシルエット、内向的で感傷的、日記的な等身大。感情の露出を隠さない美学。",
    era: "1985年に萌芽、90年代に地下で成熟、2000年代前半にメインストリームで爆発した。",
    artists: [
      { name: "Sunny Day Real Estate", note: "90年代エモの叙情性を決定づけた、内省的で美しいバンド。",
        songs: [{ t: "Seven", q: "Sunny Day Real Estate Seven", sp: "4mQfmZSNbkpIHua7lsVU7k" }, { t: "In Circles", q: "Sunny Day Real Estate In Circles", sp: "3XTXwcIu8tC9kwRFIfCIjT" }] },
      { name: "American Football", note: "ミッドウェスト・エモの金字塔。複雑なギターと繊細な感傷。",
        songs: [{ t: "Never Meant", q: "American Football Never Meant", sp: "6kZqCqD1r08sJAQ1TjuEpM" }] },
    ],
  },
  {
    id: "pop_punk",
    name: "ポップ・パンク",
    en: "Pop Punk",
    gen: 8, x: 0.25, years: "1994–2005",
    parents: ["punk", "hardcore_punk"],
    hue: 15,
    tagline: "パンクの速度に、キャッチーな青春を乗せて。",
    interpretation:
      "パンクの疾走感に明快なポップのメロディを結合したもの。ラモーンズにその原型を見る立場もあるが、ジャンルとして確立したのは90年代のグリーン・デイの大成功以降。パンクの純粋主義者からは『商業化・軟弱化した裏切り』と批判される一方、無数の若者をロックへ導いた入り口でもある。",
    sound:
      "速く明快なパワーコード、キャッチーな大合唱コーラス、青春・恋愛・郊外の退屈を歌う歌詞、明るく親しみやすい質感。",
    visual:
      "スケートボード、郊外、Tシャツとスニーカー、ユーモアと若さ。深刻ぶらない等身大の10代文化。",
    era: "1994年のグリーン・デイ『Dookie』で爆発。2000年代前半にブリンク182らでメインストリーム化した。",
    artists: [
      { name: "Green Day", note: "パンクをスタジアムへ持ち込み、90年代以降の入門ロックを定義した。",
        songs: [{ t: "Basket Case", q: "Green Day Basket Case", sp: "6L89mwZXSOwYl76YXfX13s" }, { t: "American Idiot", q: "Green Day American Idiot", sp: "6nTiIhLmQ3FWhvrGafw2zj" }] },
      { name: "blink-182", note: "ユーモアとメロディでポップ・パンクを2000年代の巨大現象にした。",
        songs: [{ t: "All the Small Things", q: "blink-182 All the Small Things", sp: "2m1hi0nfMR9vdGC8UcrnwU" }, { t: "What's My Age Again?", q: "blink-182 What's My Age Again", sp: "2BCEmJarwzuweXx1wTf1md" }] },
    ],
  },
  {
    id: "nu_metal",
    name: "ニューメタル",
    en: "Nu Metal",
    gen: 8, x: 0.15, years: "1996–2003",
    parents: ["thrash_metal", "industrial_rock"],
    hue: 200,
    tagline: "メタル、ヒップホップ、ファンクの混血児。",
    interpretation:
      "メタルの重さに、ヒップホップのリズムとDJ、ファンクのグルーヴを混ぜた雑食のジャンル。商業的成功ゆえに『メタルの堕落』として長く軽視されてきたが、内面の痛みや疎外を率直に扱った点、ジャンル横断的だった点で近年再評価が進む。",
    sound:
      "ダウンチューニングした鈍いリフ(7弦ギター)、シンコペーションの効いたグルーヴ、ラップとシャウトの交替、スクラッチやサンプリング。怒りと苦悩を吐き出す歌詞。",
    visual:
      "ダボダボの服とドレッド、身体改造、都市の荒廃、ストリート寄りのスタイル。メタルの様式美よりヒップホップの即物性。",
    era: "1996〜2003年に隆盛。ガレージ・リヴァイヴァルの登場で流行は退くが、後のメタルコアやトラップメタルに影響を残す。",
    artists: [
      { name: "Korn", note: "7弦ギターの鈍い重さと生々しいトラウマの吐露で、ニューメタルを発明した。",
        songs: [{ t: "Freak on a Leash", q: "Korn Freak on a Leash", sp: "6W21LNLz9Sw7sUSNWMSHRu" }, { t: "Blind", q: "Korn Blind", sp: "1pr9TZGOXeJUggIal1Wq3R" }] },
      { name: "System of a Down", note: "変則的な構成と政治性で、ニューメタルの枠を超えた唯一無二の存在。",
        songs: [{ t: "Chop Suey!", q: "System of a Down Chop Suey", sp: "2DlHlPMa4M17kufBvI2lEN" }, { t: "Toxicity", q: "System of a Down Toxicity", sp: "0snQkGI5qnAmohLE7jTsTn" }] },
    ],
  },
  {
    id: "indie_rock",
    name: "インディー・ロック",
    en: "Indie Rock",
    gen: 8, x: 0.91, years: "1994–",
    parents: ["college_alt"],
    hue: 85,
    tagline: "独立という姿勢。やがて音そのものの形容詞になった。",
    interpretation:
      "本来は『インディペンデント・レーベル所属』という流通上の定義で、音楽性を指さなかった。だが2000年代以降、特定のサウンド(繊細・折衷的・非マッチョ)を漠然と指す形容詞に変質し、大手所属でも『インディー』と呼ばれる矛盾を抱える。ジャンル名としての曖昧さの典型例。",
    sound:
      "極めて多様だが、傾向としてローファイな質感、旋律重視、内省的な歌詞、実験と親しみやすさのバランス。過剰な技巧やマチズモを避ける。",
    visual:
      "古着とDIY、アートスクール的センス、飾らないが趣味の良い等身大。反・スタジアム、反・グラマラスの美学。",
    era: "1994年頃から連続し、2000年代のインディー・ブームで拡大。以後ロックの主要な受け皿として今日まで続く。",
    artists: [
      { name: "Pavement", note: "ローファイと脱力の美学で、90年代インディーの精神性を象徴した。",
        songs: [{ t: "Cut Your Hair", q: "Pavement Cut Your Hair", sp: "4tBl1xhBg5PETpBvFnQmGl" }, { t: "Range Life", q: "Pavement Range Life", sp: "6jR6FMCEoWGdEpFVRlMZM7" }] },
      { name: "Arcade Fire", note: "壮大なアンサンブルで、2000年代インディーを感動の芸術へ押し上げた。",
        songs: [{ t: "Wake Up", q: "Arcade Fire Wake Up", sp: "4VAkPXhI7xQ6FHlUuY3RzB" }, { t: "Rebellion (Lies)", q: "Arcade Fire Rebellion Lies", sp: "0xOeB16JDbBJBJKSdHbElT" }] },
    ],
  },

  /* ---------------- 2000s– ---------------- */
  {
    id: "garage_revival",
    name: "ガレージ / ポストパンク・リヴァイヴァル",
    en: "Garage / Post-Punk Revival",
    gen: 9, x: 0.72, years: "2001–2008",
    parents: ["garage", "post_punk", "indie_rock"],
    hue: 30,
    tagline: "過剰な90年代の後、ロックは生々しい原点へ回帰した。",
    interpretation:
      "ニューメタルやポスト・グランジの肥大化への反動として、60年代ガレージや70〜80年代ポストパンクの簡潔さ・生々しさを甦らせた運動。『ロック復権』と讃えられた一方、『過去の焼き直し=創造性の枯渇』とみる批判もあり、後にジャンルの直線的進化が終わった徴候とも解釈される。",
    sound:
      "簡潔で生々しいギター、無駄を削いだ構成、レトロな録音感、アンガー(角ばったギター)とキャッチーさの両立。原点回帰の直情。",
    visual:
      "細身のスーツやレザー、レトロなクールネス、都会的でシャープ。60〜70年代のスタイルの洗練された再解釈。",
    era: "2001〜08年に隆盛。ロックが大衆音楽の中心にいた、事実上『最後の大きな波』ともいわれる。",
    artists: [
      { name: "The Strokes", note: "NYの気だるいクールネスで、2000年代ロック・リヴァイヴァルの号砲を鳴らした。",
        songs: [{ t: "Last Nite", q: "The Strokes Last Nite", sp: "3SUusuA9jH1v6PVwtYMbdv" }, { t: "Reptilia", q: "The Strokes Reptilia", sp: "57Xjny5yNzAcsxnusKmAfA" }] },
      { name: "The White Stripes", note: "ギターとドラムだけの原始的編成で、ブルースの生々しさを現代へ甦らせた。",
        songs: [{ t: "Seven Nation Army", q: "The White Stripes Seven Nation Army", sp: "3dPQuX8Gs42Y7b454ybpMR" }, { t: "Fell in Love with a Girl", q: "The White Stripes Fell in Love with a Girl", sp: "21Qsj3cMVCx2xF2EVVNbEu" }] },
      { name: "Arctic Monkeys", note: "英国の若者の日常を鋭く描き、インターネット時代の最初の大型バンドになった。",
        songs: [{ t: "I Bet You Look Good on the Dancefloor", q: "Arctic Monkeys I Bet You Look Good on the Dancefloor", sp: "3DQVgcqaP3iSMbaKsd57l5" }, { t: "Do I Wanna Know?", q: "Arctic Monkeys Do I Wanna Know", sp: "5FVd6KXrgO9B3JPmC8OPst" }] },
    ],
  },
  {
    id: "metalcore",
    name: "メタルコア",
    en: "Metalcore",
    gen: 9, x: 0.12, years: "2002–2010",
    parents: ["thrash_metal", "hardcore_punk", "extreme_metal"],
    hue: 250,
    tagline: "ハードコアの叫びと、メタルの重さと、旋律の甘さ。",
    interpretation:
      "ハードコアとエクストリーム・メタルの融合。特に2000年代の『メロディック・メタルコア』は、絶叫の激しさとクリーンで甘いサビ(メロディ)を交替させる様式で商業的に大成功した。純粋主義者からは『商業的なマスコア』と揶揄されるが、若い世代のヘヴィ・ミュージックの主要な入り口となった。",
    sound:
      "重いメタルのリフとブレイクダウン(モッシュを誘う低速の重い部分)、グロウルやスクリームとクリーン・ボーカルの交替、旋律的なサビ。",
    visual:
      "黒基調でタトゥーやピアス、モッシュピットとスパイダー・ダンス、スケート/ストリート寄りの若者文化。",
    era: "2002〜10年に隆盛。以後もジェント(Djent)などへ進化しつつ、現代ヘヴィ・ミュージックの主流であり続ける。",
    artists: [
      { name: "Killswitch Engage", note: "メロディック・メタルコアの様式を確立し、2000年代を代表した。",
        songs: [{ t: "The End of Heartache", q: "Killswitch Engage The End of Heartache", sp: "6WrusttQhWlojn3WKlPTaY" }, { t: "My Curse", q: "Killswitch Engage My Curse", sp: "6zKF4293k44ItKWJJgrhXv" }] },
      { name: "Bring Me the Horizon", note: "メタルコアから出発し、あらゆる音を飲み込んで進化を続ける現代の巨人。",
        songs: [{ t: "Can You Feel My Heart", q: "Bring Me the Horizon Can You Feel My Heart", sp: "0WSa1sucoNRcEeULlZVQXj" }, { t: "Throne", q: "Bring Me the Horizon Throne", sp: "5tYqrn7cItYhDGDLHt8XuH" }] },
    ],
  },
  {
    id: "emo_pop",
    name: "エモ / スクリーモ (2000s)",
    en: "Emo Pop / Screamo",
    gen: 9, x: 0.34, years: "2003–2009",
    parents: ["emo", "pop_punk"],
    hue: 345,
    tagline: "MySpace世代のドラマ。黒い前髪と決壊する感情。",
    interpretation:
      "2000年代半ば、エモとポップ・パンクが融合しメインストリーム化した波。90年代エモの当事者からは『本来のエモとは別物』と厳しく線引きされる。だが一つの世代(MySpace/Warped Tour世代)にとっては、これこそが『エモ』であり、青春そのものだった。",
    sound:
      "キャッチーなポップ・パンクの土台に、劇的な展開と告白的な歌詞、時に絶叫(スクリーモ)を交える。感情の起伏を最大化する構成。",
    visual:
      "黒く長い斜め前髪、アイライナー、細身のスキニー、感傷とドラマ。感情の露出を美学化したティーンの記号。",
    era: "2003〜09年に隆盛。MySpaceとWarped Tourを土壌に一大文化を築き、後年ノスタルジーとして繰り返し再評価される。",
    artists: [
      { name: "My Chemical Romance", note: "演劇的なコンセプトと激情で、2000年代エモを芸術的頂点へ導いた。",
        songs: [{ t: "Welcome to the Black Parade", q: "My Chemical Romance Welcome to the Black Parade", sp: "5wQnmLuC1W7ATsArWACrgW" }, { t: "Helena", q: "My Chemical Romance Helena", sp: "5dTHtzHFPyi8TlTtzoz1J9" }] },
      { name: "Fall Out Boy", note: "ひねくれた歌詞とキャッチーさで、エモ・ポップを世界的なポップへ橋渡しした。",
        songs: [{ t: "Sugar, We're Goin Down", q: "Fall Out Boy Sugar We're Goin Down", sp: "2TfSHkHiFO4gRztVIkggkE" }, { t: "Thnks fr th Mmrs", q: "Fall Out Boy Thnks fr th Mmrs", sp: "3Zwu2K0Qa5sT6teCCHPShP" }] },
    ],
  },
];
