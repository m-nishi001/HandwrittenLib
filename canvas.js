// 共通設定
const DEFAULT_LINE_COLOR = "#FFFFFF";
const DEFAULT_INVERT_LINE_COLOR = "#000000";
const DEFAULT_CHARACTER_COLOR = "#FFFFFF";
const DEFAULT_INVERT_CHARACTER_COLOR = "#000000";
const DEFAULT_FILLCOLOR = "#008080";
const DEFAULT_OVER_FILLCOLOR = "#FFFFFF";
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_CHARACTER_WIDTH = 1;
// const DEFAULT_HORIZONTAL_MARGIN = 15;
// const DEFAULT_VERTICAL_MARGIN = 15;
const DEFAULT_CHARACTER_FONT = 'serif';
const DEFAULT_COLOR_LIST = ['ffc0cb', '#ffa500', '#7fffd4', '#000000'];
const DEFAULT_WIDTH_LIST = [10, 15, 20, 25];

function init(obj) {

    // 初期化
    var stage = new createjs.Stage(obj.id);

    // キャンバス幅調整
    stage.canvas.width = obj.width != null ? obj.width : window.innerWidth * 0.6;
    stage.canvas.height = obj.height != null ? obj.height : window.innerHeight * 0.7;

    // デフォルト値初期化
    initializeDefault(stage.canvas.width, stage.canvas.height);

    // タッチデバイス対応
    if(createjs.Touch.isSupported()){
        createjs.Touch.enable(stage);
    }

    // マウスオーバー有効化
    stage.enableMouseOver();

    // 各種コンテンツ生成
    let contentContainer = new createjs.Container();
    let contents = obj.btn == null ? defaultBtnPropertyList : obj.btn;
    // let contentsCount = contents.length;
    let contentsCount = 8;

    for(let i = 0; i < contentsCount; i++){
        // 作成するコンテンツのタイプを取得
        let type = contents[i].type;
        let content;
        if(type === 'rect'){
            // 単純四角の場合
            content = drawRect(contents[i]);
        }else if(type === 'roundRect'){
            // 単純角丸四角の場合
            content = drawRoundRect(contents[i]);
        }else if(type === 'text'){
            // 単純文字列の場合
            content = drawText(contents[i]);
        }else if(type === 'btn'){
            // 単純ボタンの場合
            content = drawBtn(contents[i]);
        }else if(type === 'popBtn'){
            // ポップアップボタンの場合
            content = drawSpeechBalloons(contents[i]);
        }

        contentContainer.addChild(content);
    }

    stage.addChild(contentContainer); // 表示リストに追加

    // Stageの描画を更新
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);
    function onTick() {
      stage.update(); // Stageの描画を更新
    }

    // ------------------------------------------------
    // 共通変数（デフォルト値）
    // ------------------------------------------------
    
    var defaultHorizontalMargin, defaultVerticalMargin;
    var defaultLineColor, defaultFillColor, defaultCharacterColor, defaultOverFillColor;
    var defaultLineWidth, defaultCharacterWidth, defaultShapeSize, defaultButtonHeight, defaultButtonWidth;
    var defaultFont, defaultFontSize;
    var defaultColorList, defaultPenWidthList, defaultEraserWidthList;
    var dateProperty, toolAreaProperty, penProperty, colorProperty, widthProperty, eraserProperty, saveProperty, leftProperty, rightProperty;
    var defaultBtnPropertyList;

    // ------------------------------------------------
    // 共通変数（動的変更値）
    // ------------------------------------------------
    var penWidth, eraserWidth;
    var penColor;
    var popContainer;

    // ------------------------------------------------
    // 初期化処理
    // ------------------------------------------------
    
    /** デフォルト値を設定 */
    function initializeDefault(cw, ch){
        // 余白算出
        defaultHorizontalMargin = cw * 0.01;
        defaultVerticalMargin = ch * 0.02;
        // 各値算出
        defaultButtonHeight = Math.min(cw, ch) * 0.1;
        defaultButtonWidth = Math.min(cw, ch) * 0.1;
        defaultShapeSize = Math.min(cw, ch) * 0.1;
        defaultFontSize = Math.min(cw, ch) * 0.07;

        defaultLineColor = DEFAULT_LINE_COLOR;
        defaultFillColor = DEFAULT_FILLCOLOR;
        defaultCharacterColor = DEFAULT_CHARACTER_COLOR;
        defaultLineWidth = DEFAULT_LINE_WIDTH;
        defaultCharacterWidth = DEFAULT_CHARACTER_WIDTH;
        defaultFont = DEFAULT_CHARACTER_FONT;
        defaultOverFillColor = DEFAULT_OVER_FILLCOLOR;
        defaultColorList = DEFAULT_COLOR_LIST;
        defaultPenWidthList = DEFAULT_WIDTH_LIST;
        defaultEraserWidthList = DEFAULT_WIDTH_LIST;
        defaultBtnPropertyList = [];

        penWidth = defaultPenWidthList[0];
        eraserWidth = defaultEraserWidthList[0];
        penColor = defaultColorList[0];

        let bgProperty = {
            'type': 'rect',
            'x': 0,
            'y': 0,
            'w': stage.canvas.width,
            'h': stage.canvas.height,
            'lineColor': DEFAULT_LINE_COLOR,
            'lineWidth': DEFAULT_LINE_WIDTH,
            'fillColor': defaultFillColor
        }
        defaultBtnPropertyList.push(bgProperty);

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();
        dateProperty = {
            'type': 'text',
            'x': cw * 0.9 + defaultHorizontalMargin,
            'y': ch * 0.02,
            'h': defaultButtonHeight,
            'w': defaultButtonWidth,
            'text': year + '年' + month + '月' + date + '日',
            'textColor': defaultCharacterColor,
            'textFont': defaultFont,
            'textSize': defaultFontSize
        }
        defaultBtnPropertyList.push(dateProperty);

        let penObjProperty = {
            'x': defaultButtonWidth/2,
            'y': defaultButtonHeight/2 + (ch * 0.04)/2,
            'h': ch * 0.04,
            'w': cw * 0.01,
            'lineColor': 'black',
            'lineWidth': 1,
            'bodyHeight': ch * 0.025,
            'bodyColor': 'white',
            'edgeColor': penColor
        }   
        penProperty = {
            'type': 'btn',
            'x': cw * 0.04 + defaultHorizontalMargin,
            'y': ch - ch * 0.13 - defaultVerticalMargin,
            'h': defaultButtonHeight,
            'w': defaultButtonWidth,
            'lineColor': defaultLineColor,
            'lineWidth': defaultLineWidth,
            'roundWidth': 2,
            'roundHeight': 2,
            'normalFillColor': bgProperty.fillColor,
            'overFillColor': defaultOverFillColor,
            'normalInsideObj': drawPen(penObjProperty)
            // 'penKinds': 
        }
        defaultBtnPropertyList.push(penProperty);

        let colorPopProperty = {
            'x': penProperty.x + penProperty.w + defaultHorizontalMargin,
            'y': penProperty.y - defaultShapeSize * defaultColorList.length - defaultVerticalMargin * (defaultColorList.length + 3),
            'w': defaultButtonWidth,
            'h': defaultShapeSize * defaultColorList.length + defaultVerticalMargin * (defaultColorList.length + 1),
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'roundWidth': 2,
            'roundHeight': 2,
            'balloonsFromX': penProperty.x + penProperty.w + defaultHorizontalMargin + defaultButtonWidth/2,
            'balloonsFromY': penProperty.y - defaultVerticalMargin * 2,
            'balloonsToX': penProperty.x + penProperty.w + defaultHorizontalMargin + defaultButtonWidth/2,
            'balloonsToY': penProperty.y,
            'balloonsWidth': 15,
            'fillColor': defaultFillColor,
            'colorList': defaultColorList
        }
        colorProperty = {
            'type': 'roundRect',
            'x': penProperty.x + penProperty.w + defaultHorizontalMargin,
            'y': penProperty.y,
            'h': defaultShapeSize,
            'w': defaultShapeSize,
            'lineColor': defaultLineColor,
            'lineWidth': defaultLineWidth,
            'roundWidth': 2,
            'roundHeight': 2,
            'fillColor': penColor,
            'isPopEvent': true,
            'popEventProperty': colorPopProperty
        }
        defaultBtnPropertyList.push(colorProperty);

        let subProperty = {
            'x': colorProperty.x + colorProperty.w + defaultHorizontalMargin + defaultLineWidth,
            'y': penProperty.y + defaultShapeSize/2 - penWidth/2,
            'h': penWidth,
            'w': defaultShapeSize - defaultLineWidth*2,
            'lineWidth': defaultLineWidth,
            'lineColor': 'blac',
            'fillColor': penColor
        }
        widthProperty = {
            'type': 'roundRect',
            'x': colorProperty.x + colorProperty.w + defaultHorizontalMargin,
            'y': penProperty.y,
            'h': defaultShapeSize,
            'w': defaultShapeSize,
            'lineColor': defaultLineColor,
            'lineWidth': defaultLineWidth,
            'roundWidth': 2,
            'roundHeight': 2,
            'fillColor': defaultFillColor,
            'addShpaeObj': drawRect(subProperty),
            'colorList': defaultColorList
        }
        defaultBtnPropertyList.push(widthProperty);

        toolAreaProperty = {
            'type': 'roundRect',
            'x': penProperty.x - defaultHorizontalMargin,
            'y': penProperty.y - defaultVerticalMargin,
            'w': penProperty.w + colorProperty.w + widthProperty.w + defaultHorizontalMargin * 4,
            'h': Math.max(penProperty.h, colorProperty.h, widthProperty.h) + defaultVerticalMargin * 2,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'roundWidth': 2,
            'roundHeight': 2,
            'fillColor': null
        }
        defaultBtnPropertyList.push(toolAreaProperty);

        eraserProperty = {
            'type': 'btn',
            'x': cw * 0.4,
            'y': penProperty.y,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'roundWidth': 2,
            'roundHeight': 2,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor,
            'eraserWidthList': defaultEraserWidthList
        }
        defaultBtnPropertyList.push(eraserProperty);
        
        // -----------

        saveProperty = {
            'type': 'popBtn',
            'x': eraserProperty.x + eraserProperty.w + defaultHorizontalMargin,
            'y': penProperty.y - defaultButtonHeight - 20,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': 'black',
            'roundWidth': 2,
            'roundHeight': 2,
            'balloonsFromX': eraserProperty.x + eraserProperty.w + defaultHorizontalMargin + defaultButtonWidth/2,
            'balloonsFromY': penProperty.y - 20,
            'balloonsToX': eraserProperty.x + eraserProperty.w + defaultHorizontalMargin + defaultButtonWidth/2,
            'balloonsToY': penProperty.y + 10,
            'balloonsWidth': 15,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor,
            'eraserWidthList': defaultEraserWidthList
        }
        defaultBtnPropertyList.push(saveProperty);


        // ------------
        saveProperty = {
            'type': 'btn',
            'x': eraserProperty.x + eraserProperty.w + defaultHorizontalMargin,
            'y': penProperty.y,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'roundWidth': 2,
            'roundHeight': 2,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor,
            'eraserWidthList': defaultEraserWidthList
        }
        defaultBtnPropertyList.push(saveProperty);

        leftProperty = {
            'type': 'btn',
            'x': cw * 0.8,
            'y': penProperty.h,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor
        }
        defaultBtnPropertyList.push(leftProperty);

        rightProperty = {
            'type': 'btn',
            'x': leftProperty + defaultHorizontalMargin,
            'y': penProperty.h,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor
        }
        defaultBtnPropertyList.push(rightProperty);
    }

    // ------------------------------------------------
    // 共通機能（図形）
    // ------------------------------------------------

    /** 文字列オブジェクトを生成
     * 
     * @param {int} x x座標
     * @param {int} y y座標
     * @param {string} text 文字列
     * @param {string} textFont 文字フォント
     * @param {int} textSize 文字サイズ
     * @param {string} textColor 文字色
     * @param {string} textAlign 文字の水平方向オプション
     * @param {string} textBaseline 文字の垂直方向オプション
     * @return {obj} 文字列オブジェクト
     */
    function drawText(arg){
        let textFontOption = arg.textSize + 'px ' + arg.textFont;
        let text = new createjs.Text(arg.text, textFontOption, arg.textColor);

        // 座標設定
        text.x = arg.x;
        text.y = arg.y;
        
        // 座標補正
        let cx = stage.x + stage.canvas.width;
        let textX = text.x + text.getMeasuredWidth();
        if(cx < textX){
            text.x -= textX - cx + defaultHorizontalMargin;
        }

        if(arg.textAlign != null){
            text.textAlign = arg.textAlign;
        }
        if(arg.textBaseline != null){
            text.textBaseline = arg.textBaseline;
        }

        return text;
    }

    /** 四角形（通常）を生成
     * 
     * @param {int} x x座標
     * @param {int} y y座標
     * @param {int} w 幅
     * @param {int} h 高さ
     * @param {int} lineWidth 線の幅
     * @param {string} lineColor 枠線の色
     * @param {string} fillColor 図形内の塗りつぶし色
     * @return {obj} 四角形（通常）オブジェクト
     * 
    */
    function drawRect(arg){
        let rect = new createjs.Shape();

        rect.graphics.beginStroke(arg.lineColor)
                    .setStrokeStyle(arg.lineWidth)
                    .beginFill(arg.fillColor)
                    .drawRect(arg.x, arg.y, arg.w, arg.h)
                    .endStroke();

        return rect;
    }

    /** 四角形（角丸）を生成
     * 
     * @param {int} x x座標
     * @param {int} y y座標
     * @param {int} w 幅
     * @param {int} h 高さ
     * @param {int} lineWidth 線の幅
     * @param {int} roundWidth 角丸の幅
     * @param {int} roundHeight 角丸の高さ
     * @param {string} fillColor 図形内の塗りつぶし色
     * @param {string} lineColor 図形の枠線の色
     * @param {obj} addShpaeObj 追加する図形オブジェクト
     * @param {boolean} isPopEvent ポップアップイベントの有無
     * @param {obj} popEventProperty ポップアップイベントのプロパティ
     * @return {obj} 四角形（角丸）オブジェクト
     * 
    */
   function drawRoundRect(arg){
    
    let roundRectContainer = new createjs.Container();

    let roundRect = new createjs.Shape();

    roundRect.graphics.beginStroke(arg.lineColor)
                .setStrokeStyle(arg.lineWidth)
                .beginFill(arg.fillColor)
                .drawRoundRect(arg.x, arg.y, arg.w, arg.h, arg.roundWidth, arg.roundHeight)
                .endStroke();

    roundRectContainer.addChild(roundRect);

    if(arg.addShpaeObj != null){
        // 追加するオブジェクトがある場合
        roundRectContainer.addChild(arg.addShpaeObj);
    }

    if(isPopEvent){
        
    }

    return roundRectContainer;
    }

    /** 吹き出しを生成
     * 
     * @param {int} x x座標
     * @param {int} y y座標
     * @param {int} w 幅
     * @param {int} h 高さ
     * @param {int} lineWidth 線の幅
     * @param {int} balloonsFromX 吹き出し元のX位置
     * @param {int} balloonsFromY 吹き出し元のY位置
     * @param {int} balloonsToX 吹き出し先のX位置
     * @param {int} balloonsToY 吹き出し先のY位置
     * @param {int} balloonsWidth 吹き出し元の幅
     * @param {int} roundWidth 角丸の幅
     * @param {int} roundHeight 角丸の高さ
     * @param {string} fillColor 図形内の塗りつぶし色
     * @param {string} lineColor 図形の枠線の色
     * @param {obj} addShpaeObj 追加する図形オブジェクト
     * @return {obj} 吹き出しオブジェクト
     * 
    */
   function drawSpeechBalloons(arg){
    let speechBalloons = new createjs.Shape();

    speechBalloons.graphics
                .beginStroke(arg.lineColor)
                .setStrokeStyle(arg.lineWidth)
                .beginFill(arg.fillColor)
                .drawRoundRect(arg.x, arg.y, arg.w, arg.h, arg.roundWidth, arg.roundHeight);

    // 吹き出し口を生成
    let bx = (arg.x < arg.balloonsFromX && arg.balloonsFromX < arg.x + arg.w) ? arg.balloonsFromX - arg.balloonsWidth/2 : arg.balloonsFromX;
    let by = (arg.y < arg.balloonsFromY && arg.balloonsFromY < arg.y + arg.h) ? arg.balloonsFromY - arg.balloonsWidth/2 : arg.balloonsFromY;
    let bxx = (arg.x < arg.balloonsFromX && arg.balloonsFromX < arg.x + arg.w) ? arg.balloonsFromX + arg.balloonsWidth/2 : arg.balloonsFromX;
    let byy = (arg.y < arg.balloonsFromY && arg.balloonsFromY < arg.y + arg.h) ? arg.balloonsFromY + arg.balloonsWidth/2 : arg.balloonsFromY;

    speechBalloons.graphics
                        .moveTo(bx, by)
                        .lineTo(arg.balloonsToX, arg.balloonsToY) // 左辺
                        .lineTo(bxx, byy) // 右辺

    speechBalloons.graphics
                        .beginStroke(arg.fillColor)
                        .setStrokeStyle(arg.lineWidth + 1.5)
                        .moveTo(bxx, byy)
                        .lineTo(bx, by)
                        .endStroke();
    console.log(arg.fillColor)

    return speechBalloons;
    }

    // ------------------------------------------------
    // 共通機能（コンテナ）
    // ------------------------------------------------

    /** ボタンを生成
     * 
     * @param {int} x x座標
     * @param {int} y y座標
     * @param {int} w 幅
     * @param {int} h 高さ
     * @param {string} lineColor 線の色
     * @param {int} lineWidth 線の幅
     * @param {int} roundWidth 角丸の幅
     * @param {int} roundHeight 角丸の高さ
     * @param {string} normalFillColor 通常時のボタン内色
     * @param {string} overFillColor ホバー時の_ボタン内色
     * @param {obj} normalInsideObj 通常時ボタン内部オブジェクト
     * @param {obj} overInsideObj ホバー時ボタン内部オブジェクト
     * @param {array} eventList 各種イベントリスト
     * @return {obj} ボタンオブジェクト
     * 
     */
    function drawBtn(arg){
        let buttonContainer = new createjs.Container();
        buttonContainer.x = arg.x;
        buttonContainer.y = arg.y;

        // 通常時
        let normalContainer = new createjs.Container();
        let normalBtn = new createjs.Shape();
        
        normalBtn.graphics
                        .beginStroke(arg.lineColor)
                        .setStrokeStyle(arg.lineWidth)
                        .beginFill(arg.normalFillColor)
                        .drawRoundRect(0, 0, arg.w, arg.h, arg.roundWidth, arg.roundHeight)
                        .endStroke();
        normalContainer.addChild(normalBtn);
        normalContainer.addChild(arg.normalInsideObj);
        
        normalContainer.visible = true;

        buttonContainer.addChild(normalContainer);

        // ホバー時
        let overContainer = new createjs.Container();
        let overBtn = new createjs.Shape();

        overBtn.graphics
                        .beginStroke(arg.lineColor)
                        .setStrokeStyle(arg.lineWidth)
                        .beginFill(arg.overFillColor)
                        .drawRoundRect(0, 0, arg.w, arg.h, arg.roundWidth, arg.roundHeight)
                        .endStroke();

        overContainer.addChild(overBtn);
        // overContainer.addChild(arg.overInsideObj);
        overContainer.visible = false;

        buttonContainer.addChild(overContainer);

        // ホバー時イベント登録
        buttonContainer.addEventListener("mouseover", mouseOverEvent);
        buttonContainer.addEventListener("mouseout", mouseOutEvent);

        function mouseOverEvent(){
            normalContainer.visible = false;
            overContainer.visible = true;
        }

        function mouseOutEvent(){
            normalContainer.visible = true;
            overContainer.visible = false;
        }

    　  // 各種イベント追加
        if(arg.eventList != null){
            let eventCount = arg.eventList.length;
            if(eventCount > 0){
                for(let i = 0; i < eventCount; i++){
                    buttonContainer.addEventListener(arg.eventList[i].event, arg.eventList[i].func);
                }
            }
        }

        return buttonContainer;
    }

    // ------------------------------------------------
    // 任意の図形を表示
    // ------------------------------------------------

    /** ペンマークを生成
     * 
     * @param {int} x x座標（ペン元）
     * @param {int} y y座標（ペン元）
     * @param {int} w ペン幅
     * @param {int} h ペン高さ
     * @param {int} lineColor ペン外枠カラー
     * @param {int} lineWidth ペン外枠幅
     * @param {int} bodyHeight ペン本体高さ
     * @param {string} bodyColor 本体カラー
     * @param {string} edgeColor 先端カラー
     * @return {obj} ペンマークオブジェクト
     * 
     */
    function drawPen(arg){
        let penContainer = new createjs.Container();

        // ペン本体部分
        let penBodyShape = new createjs.Shape();
        penBodyShape.graphics
                        .setStrokeStyle(arg.lineWidth)
                        .beginStroke(arg.lineColor)
                        .beginFill(arg.bodyColor)
                        .moveTo(arg.x - arg.w/2, arg.y)
                        .lineTo(arg.x - arg.w/2, arg.y - arg.bodyHeight) // 左辺
                        .lineTo(arg.x + arg.w/2, arg.y - arg.bodyHeight) // 上辺
                        .lineTo(arg.x + arg.w/2, arg.y) // 右辺
                        .lineTo(arg.x - arg.w/2, arg.y) // 下辺
                        .endStroke();

        penContainer.addChild(penBodyShape);

        // ペン先端部分
        let penEdgeShape = new createjs.Shape();
        penEdgeShape.graphics
                        .setStrokeStyle(arg.lineWidth)
                        .beginStroke(arg.lineColor)
                        .beginFill(arg.edgeColor)
                        .moveTo(arg.x - arg.w/2, arg.y - arg.bodyHeight)
                        .lineTo(arg.x, arg.y - arg.h) // 左辺
                        .lineTo(arg.x + arg.w/2, arg.y - arg.bodyHeight) // 右辺
                        .endStroke();

        penContainer.addChild(penEdgeShape);

        return penContainer;
    }

    // ------------------------------------------------
    // 共通関数
    // ------------------------------------------------
    
    /** ポップアップ処理
     * 
     */
    function popUp(obj){
        if(popContainer == null){
            popContainer = obj;
            stage.addChild(popContainer);
        }else{
            popContainer = obj;
        }   
    }
  }