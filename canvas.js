// 共通設定
const DEFAULT_LINE_COLOR = "#FFFFFF";
const DEFAULT_INVERT_LINE_COLOR = "#000000";
const DEFAULT_CHARACTER_COLOR = "#FFFFFF";
const DEFAULT_INVERT_CHARACTER_COLOR = "#000000";
const DEFAULT_FILLCOLOR = "#008030";
const DEFAULT_OVER_FILLCOLOR = "#FFFFFF";
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_CHARACTER_WIDTH = 1;
const DEFAULT_HORIZONTAL_MARGIN = 15;
const DEFAULT_VERTICAL_MARGIN = 15;
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
    let contentsCount = 3;

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
            // content = drawPopBtn(contents[i]);
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
    
    var defaultLineColor, defaultFillColor, defaultCharacterColor, defaultOverFillColor;
    var defaultLineWidth, defaultCharacterWidth, defaultShapeSize, defaultButtonHeight, defaultButtonWidth;
    var defaultFont, defaultFontSize;
    var defaultColorList, defaultPenWidthList, defaultEraserWidthList;
    var dateProperty, toolAreaProperty, penProperty, colorProperty, widthProperty, eraserProperty, saveProperty, leftProperty, rightProperty;
    var defaultBtnPropertyList;

    // ------------------------------------------------
    // 初期化処理
    // ------------------------------------------------
    
    /** デフォルト値を設定 */
    function initializeDefault(cw, ch){
        defaultLineColor = DEFAULT_LINE_COLOR;
        defaultFillColor = DEFAULT_FILLCOLOR;
        defaultCharacterColor = DEFAULT_CHARACTER_COLOR;
        defaultLineWidth = DEFAULT_LINE_WIDTH;
        defaultCharacterWidth = DEFAULT_CHARACTER_WIDTH;
        defaultButtonHeight = Math.min(cw, ch) * 0.1;
        defaultButtonWidth = Math.min(cw, ch) * 0.1;
        defaultShapeSize = Math.min(cw, ch) * 0.1;
        defaultFont = DEFAULT_CHARACTER_FONT;
        defaultFontSize = Math.min(cw, ch) * 0.07;
        defaultOverFillColor = DEFAULT_OVER_FILLCOLOR;
        defaultColorList = DEFAULT_COLOR_LIST;
        defaultPenWidthList = DEFAULT_WIDTH_LIST;
        defaultEraserWidthList = DEFAULT_WIDTH_LIST;
        defaultBtnPropertyList = [];

        console.log("キャンバス幅 : " + cw + " キャンバス高さ : " + ch);

        let bgProperty = {
            'type': 'rect',
            'x': 0,
            'y': 0,
            'w': stage.canvas.width,
            'h': stage.canvas.height,
            'lineColor': DEFAULT_LINE_COLOR,
            'lineWidth': DEFAULT_LINE_WIDTH,
            'fillColor': '#008080'
        }
        defaultBtnPropertyList.push(bgProperty);

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();
        dateProperty = {
            'type': 'text',
            'x': cw * 0.9 + DEFAULT_HORIZONTAL_MARGIN,
            'y': ch * 0.02,
            'h': defaultButtonHeight,
            'w': defaultButtonWidth,
            'text': year + '年' + month + '月' + date + '日',
            'textColor': defaultCharacterColor,
            'textFont': defaultFont,
            'textSize': defaultFontSize,
        }
        defaultBtnPropertyList.push(dateProperty);

        penProperty = {
            'type': 'btn',
            'x': cw * 0.01 + DEFAULT_HORIZONTAL_MARGIN,
            'y': ch - ch * 0.1,
            'h': defaultButtonHeight,
            'w': defaultButtonWidth,
            'lineColor': defaultLineColor,
            'lineWidth': defaultLineWidth,
            'roundWidth': 2,
            'roundHeight': 2,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor
            // 'penKinds': 
        }
        defaultBtnPropertyList.push(penProperty);

        colorProperty = {
            'type': 'btn',
            'x': penProperty.x + penProperty.w + DEFAULT_HORIZONTAL_MARGIN,
            'y': penProperty.h,
            'h': defaultShapeSize,
            'w': defaultShapeSize,
            'colorList': defaultColorList
        }
        defaultBtnPropertyList.push(colorProperty);

        widthProperty = {
            'type': 'btn',
            'x': penProperty.x + penProperty.w + DEFAULT_HORIZONTAL_MARGIN,
            'y': penProperty.h,
            'h': defaultPenWidthList[0],
            'w': defaultShapeSize,
            'widthList': defaultPenWidthList
        }
        defaultBtnPropertyList.push(widthProperty);

        toolAreaProperty = {
            'type': 'shape',
            'x': penProperty.x + DEFAULT_HORIZONTAL_MARGIN,
            'y': penProperty.y - DEFAULT_VERTICAL_MARGIN,
            'w': penProperty.w + colorProperty.w + widthProperty.w + DEFAULT_HORIZONTAL_MARGIN * 4,
            'h': Math.max(penProperty.h, colorProperty.h, widthProperty.h) + DEFAULT_VERTICAL_MARGIN,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'fillColor': null
        }
        defaultBtnPropertyList.push(toolAreaProperty);

        eraserProperty = {
            'type': 'btn',
            'x': cw * 0.1,
            'y': penProperty.h,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor,
            'eraserWidthList': defaultEraserWidthList
        }
        defaultBtnPropertyList.push(eraserProperty);

        saveProperty = {
            'type': 'btn',
            'x': eraserProperty + DEFAULT_HORIZONTAL_MARGIN,
            'y': penProperty.h,
            'w': defaultButtonWidth,
            'h': defaultButtonHeight,
            'lineWidth': defaultLineWidth,
            'lineColor': defaultLineColor,
            'normalFillColor': defaultFillColor,
            'overFillColor': defaultOverFillColor
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
            'x': leftProperty + DEFAULT_HORIZONTAL_MARGIN,
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
            text.x -= textX - cx + DEFAULT_HORIZONTAL_MARGIN;
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
     * @return {obj} 四角形（角丸）オブジェクト
     * 
    */
   function drawRoundRect(arg){
    let roundRect = new createjs.Shape();

    roundRect.graphics.beginStroke(arg.lineColor)
                .setStrokeStyle(arg.lineWidth)
                .beginFill(arg.fillColor)
                .drawRoundRect(arg.x, arg.y, arg.w, arg.h, arg.roundWidth, arg.roundHeight)
                .endStroke();

    return roundRect;
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
     * @return {obj} 吹き出しオブジェクト
     * 
    */
   function drawSpeechBalloons(arg){
    let speechBalloons = new createjs.Shape();

    speechBalloons.graphics
                .beginStroke(arg.get('lineColor') == null ? defaultLineColor : arg.get('lineColor'))
                .setStrokeStyle(arg.get('lineWidth') == null ? defaultLineWidth : arg.get('lineWidth'))
                .beginFill(arg.get('fillColor') == null ? defaultFillColor : arg.get('fillColor'))
                .drawRoundRect(arg.get('x'), arg.get('y'), arg.get('w'), arg.get('h'), arg.get('roundWidth'), arg.get('roundHeight'));

    // 吹き出し口を生成
    let bx = (x < balloonsFromX && balloonsFromX < x + width) ? balloonsFromX - balloonsWidth : balloonsFromX;
    let by = (y < balloonsFromY && balloonsFromY < y + height) ? balloonsFromY - balloonsWidth : balloonsFromY;
    let bxx = (x < balloonsFromX && balloonsFromX < x + width) ? balloonsFromX + balloonsWidth : balloonsFromX;
    let byy = (y < balloonsFromY && balloonsFromY < y + height) ? balloonsFromY + balloonsWidth : balloonsFromY;

    speechBalloons.graphics
                        .moveTo(bx, by)
                        .lineTo(balloonsToX, balloonsToY)
                        .lineTo(bxx, byy)
                        .beginStroke(arg.get('fillColor') == null ? defaultFillColor : arg.get('fillColor'))
                        .lineTo(bx, by)
                        .endStroke();

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
        // normalContainer.addChild(arg.normalInsideObj);
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

    /** イベント付図形を生成
     * 
     * @param {obj} baseShape イベント対象図形
     * @param {obj} eventObj イベントオブジェクト
     * 
     */
    function shapeWithEvent(arg){

    }
  }