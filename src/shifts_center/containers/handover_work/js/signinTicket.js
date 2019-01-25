function signinTicket(downloadTicketsData) {
    shift.prototype.Canvas2Image = function () {
        // check if support sth.
        var $support = function () {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            return {
                canvas: !!ctx,
                imageData: !!ctx.getImageData,
                dataURL: !!canvas.toDataURL,
                btoa: !!window.btoa
            };
        }();

        var downloadMime = 'image/octet-stream';

        function scaleCanvas(canvas, width, height) {
            var w = canvas.width,
                h = canvas.height;
            if (width == undefined) {
                width = w;
            }
            if (height == undefined) {
                height = h;
            }

            var retCanvas = document.createElement('canvas');
            var retCtx = retCanvas.getContext('2d');
            retCanvas.width = width;
            retCanvas.height = height;
            retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
            return retCanvas;
        }

        function getDataURL(canvas, type, width, height) {
            canvas = scaleCanvas(canvas, width, height);
            return canvas.toDataURL(type);
        }

        function saveFile(strData, filename, canvas) {
            var par = canvas;
            var blob = !!par.msToBlob ? par.msToBlob() : null;
            if (!!blob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else {
                var save_link = document.createElement('a');
                save_link.href = strData;
                save_link.download = filename;
                var event = new MouseEvent('click', {"bubbles": false, "cancelable": false});
                save_link.dispatchEvent(event);
            }
        }

        function genImage(strData) {
            var img = document.createElement('img');
            img.src = strData;
            return img;
        }

        function fixType(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        }

        function encodeData(data) {
            if (!window.btoa) {
                throw 'btoa undefined'
            }
            var str = '';
            if (typeof data == 'string') {
                str = data;
            } else {
                for (var i = 0; i < data.length; i++) {
                    str += String.fromCharCode(data[i]);
                }
            }

            return btoa(str);
        }

        function getImageData(canvas) {
            var w = canvas.width,
                h = canvas.height;
            return canvas.getContext('2d').getImageData(0, 0, w, h);
        }

        function makeURI(strData, type) {
            return 'data:' + type + ';base64,' + strData;
        }


        /**
         * create bitmap image
         * 按照规则生成图片响应头和响应体
         */
        var genBitmapImage = function (oData) {

            var biWidth = oData.width;
            var biHeight = oData.height;
            var biSizeImage = biWidth * biHeight * 3;
            var bfSize = biSizeImage + 54; // total header size = 54 bytes

            var BITMAPFILEHEADER = [
                // WORD bfType -- The file type signature; must be "BM"
                0x42, 0x4D,
                // DWORD bfSize -- The size, in bytes, of the bitmap file
                bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
                // WORD bfReserved1 -- Reserved; must be zero
                0, 0,
                // WORD bfReserved2 -- Reserved; must be zero
                0, 0,
                // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
                54, 0, 0, 0
            ];


            var BITMAPINFOHEADER = [
                // DWORD biSize -- The number of bytes required by the structure
                40, 0, 0, 0,
                // LONG biWidth -- The width of the bitmap, in pixels
                biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
                // LONG biHeight -- The height of the bitmap, in pixels
                biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
                // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
                1, 0,
                // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
                // has a maximum of 2^24 colors (16777216, Truecolor)
                24, 0,
                // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
                0, 0, 0, 0,
                // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
                biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
                // LONG biXPelsPerMeter, unused
                0, 0, 0, 0,
                // LONG biYPelsPerMeter, unused
                0, 0, 0, 0,
                // DWORD biClrUsed, the number of color indexes of palette, unused
                0, 0, 0, 0,
                // DWORD biClrImportant, unused
                0, 0, 0, 0
            ];

            var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

            var aImgData = oData.data;

            var strPixelData = '';
            var biWidth4 = biWidth << 2;
            var y = biHeight;
            var fromCharCode = String.fromCharCode;

            do {
                var iOffsetY = biWidth4 * (y - 1);
                var strPixelRow = '';
                for (var x = 0; x < biWidth; x++) {
                    var iOffsetX = x << 2;
                    strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) +
                        fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) +
                        fromCharCode(aImgData[iOffsetY + iOffsetX]);
                }

                for (var c = 0; c < iPadding; c++) {
                    strPixelRow += String.fromCharCode(0);
                }

                strPixelData += strPixelRow;
            } while (--y);

            var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

            return strEncoded;
        };

        /**
         * [saveAsImage]
         * @param  {[obj]} canvas   [canvasElement]
         * @param  {[Number]} width    [optional] png width
         * @param  {[Number]} height   [optional] png height
         * @param  {[String]} type     [image type]
         * @param  {[String]} filename [image filename]
         * @return {[type]}          [description]
         */
        var saveAsImage = function (canvas, width, height, type, filename) {
            if ($support.canvas && $support.dataURL) {
                if (typeof canvas == "string") {
                    canvas = document.getElementById(canvas);
                }
                if (type == undefined) {
                    type = 'png';
                }
                filename = filename == undefined || filename.length === 0 ? Date.now() + '.' + type : filename + '.' + type
                type = fixType(type);

                if (/bmp/.test(type)) {
                    var data = getImageData(scaleCanvas(canvas, width, height));
                    var strData = genBitmapImage(data);

                    saveFile(makeURI(strData, downloadMime), filename, canvas);
                } else {
                    var strData = getDataURL(canvas, type, width, height);
                    saveFile(strData.replace(type, downloadMime), filename, canvas);
                }
            }
        };

        var convertToImage = function (canvas, width, height, type) {
            if ($support.canvas && $support.dataURL) {
                if (typeof canvas == "string") {
                    canvas = document.getElementById(canvas);
                }
                if (type == undefined) {
                    type = 'png';
                }
                type = fixType(type);

                if (/bmp/.test(type)) {
                    var data = getImageData(scaleCanvas(canvas, width, height));
                    var strData = genBitmapImage(data);
                    return genImage(makeURI(strData, 'image/bmp'));
                } else {
                    var strData = getDataURL(canvas, type, width, height);
                    return genImage(strData);
                }
            }
        };

        return {
            saveAsImage: saveAsImage,
            saveAsPNG: function (canvas, width, height, fileName) {
                return saveAsImage(canvas, width, height, 'png', fileName);
            },
            saveAsJPEG: function (canvas, width, height, fileName) {
                return saveAsImage(canvas, width, height, 'jpeg', fileName);
            },
            saveAsGIF: function (canvas, width, height, fileName) {
                return saveAsImage(canvas, width, height, 'gif', fileName);
            },
            saveAsBMP: function (canvas, width, height, fileName) {
                return saveAsImage(canvas, width, height, 'bmp', fileName);
            },

            convertToImage: convertToImage,
            convertToPNG: function (canvas, width, height) {
                return convertToImage(canvas, width, height, 'png');
            },
            convertToJPEG: function (canvas, width, height) {
                return convertToImage(canvas, width, height, 'jpeg');
            },
            convertToGIF: function (canvas, width, height) {
                return convertToImage(canvas, width, height, 'gif');
            },
            convertToBMP: function (canvas, width, height) {
                return convertToImage(canvas, width, height, 'bmp');
            }
        };

    }();

    function shift() {
        var canvas,//canvas对象,必须要有
            ctx,//呈现方式，默认2d
            $imgW, //图片的宽度
            $imgH, //图片的高度
            $imgFileName,
            $sel,//生成文件的格式，包括png，jpeg, bmp ,gif
            $font_shfit,//交班小票的字体大小
            $font_style,//字体样式
            $font,//其他字体的大小
            $margin,//小票两边的间距
            $firstLine_height,//第一行的行高
            $line_height,//每行的行高
            $height,//行内容展示的位置
            $canvasHeight,//canvas高度
            $init = false;//是否进行过初始化
        //格式化时间
        function format(shijianchuo) {
            format.prototype.add = function (m) {
                return m < 10 ? '0' + m : m;
            }
            var time = new Date(shijianchuo);
            var y = time.getFullYear() || '-';
            var m = (time.getMonth() + 1) || '-';
            var d = time.getDate() || '-';
            var h = time.getHours() || '-';
            var mm = time.getMinutes() || '-';
            var s = time.getSeconds() || '-';
            return y + '-' + format.prototype.add(m) + '-' + format.prototype.add(d) + ' ' + format.prototype.add(h) + ':' + format.prototype.add(mm) + ':' + format.prototype.add(s);
        }

        //计算下一行位置(高度),并返回位置(高度)
        function updateHeight(initHeight, customHeight = 0) {
            //如果是第一次定义高度，则直接返回高度
            if (!isNaN(parseFloat(initHeight)) && isFinite(initHeight)) {//判断是否是数字
                $height = initHeight;
                return $height;
            }

            //不更新高度
            if (typeof initHeight == 'boolean' && initHeight == false) {
                return $height;
            }

            //更新高度
            if (!initHeight) {
                $height += $line_height;
            }

            //自定义高度
            if (!!initHeight) {
                $height += customHeight;
                return $height;
            }

            return $height;
        }

        //创建canvas
        function createCanVas() {
            var canvas = document.getElementById('shift_canvas');//寻找canvas
            if (canvas) {
                return canvas;
            }
            var _canvas = document.createElement('canvas');
            _canvas.id = 'shift_canvas';
            _canvas.style = "display:none";
            _canvas.width = $imgW;
            _canvas.height = $imgH;
            document.body.appendChild(_canvas);
            return _canvas;
        }

        //数据初始化
        this.init = function (obj) {

            if (!obj) {
                obj = {};
            }
            $sel = obj.type || "png";
            $imgW = obj.w || 300;
            $imgH = obj.h || 300;
            $imgFileName = obj.fileName || new Date().getTime();
            $font_shfit = obj.font1 || "18px";//交班小票的字体大小
            $font = obj.font2 || "14px";//其他字体的大小
            $font_style = obj.font_style || "'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC'";//默认字体样式
            $margin = obj.margin || 20;
            $line_height = obj.line_height || 25;
            $firstLine_height = obj.firstLine_height || 30;

            canvas = canvas ? canvas : obj.canvasObject ? obj.canvasObject : createCanVas();
            ctx = canvas.getContext('2d');

            $init = true;
        }

        //绘制canvas并以图片形式输出
        this.drawCanvas2Img = function (responceData) {
            if (!$init) {
                this.init();
            }//如果没有初始化，则先进行初始化
            ctx.clearRect(0, 0, canvas.width, canvas.height);//清空画布
            var data = responceData ? responceData : {};
            // 防止没有数据的情况下报错
            data.orderList = data.orderList ? data.orderList : [];
            data.mbrCardSpec = data.mbrCardSpec ? data.mbrCardSpec : [];
            data.proSkuCount = data.proSkuCount ? data.proSkuCount : [];
            // 第一行的高度+有多少行*行高+支付方式*行高
            var canvasHeight = $firstLine_height + 19 * $line_height + data.orderList.length * $line_height + data.mbrCardSpec.length * $line_height + data.proSkuCount.length * $line_height;
            canvas.height = canvasHeight > $imgH ? canvasHeight : $imgH;//更新canvas高度，防止数据过多导致内容无法展示
            canvas.width = $imgW;//更新canvas宽度，防止数据过多导致内容无法展示

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, $imgW, canvasHeight);

            //交班小票
            ctx.fillStyle = '#000';
            ctx.font = $font_shfit + $font_style;
            ctx.fillText("交接班小票", ($imgW - parseInt($font_shfit) * 5) / 2, updateHeight($firstLine_height));


            //交班人
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            data.userName = data.userName ? data.userName : "";
            ctx.fillText("交班人：" + data.userName, $margin, updateHeight());

            //上班时间
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            data.startDate = data.startDate ? data.startDate : "";
            ctx.fillText("上班时间：" + data.startDate, $margin, updateHeight());

            //交班时间
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            data.endDate = data.endDate ? data.endDate : "";
            ctx.fillText("交班时间：" + data.endDate, $margin, updateHeight());


            //分界线
            ctx.beginPath();
            ctx.setLineDash([4, 1]);
            ctx.lineWidth = 1;
            ctx.moveTo(20, updateHeight());
            ctx.lineTo($imgW - 20, updateHeight(false));
            ctx.stroke();

            ctx.fillText("收银总额", ($imgW - parseInt($font) * 4) / 2, updateHeight());

            //支付方式+笔数+金额 的标题
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("支付方式", $margin, updateHeight());
            ctx.fillText("笔数", $margin + $imgW / 3 + (parseInt($font) * 2) / 2, updateHeight(false));//左边的间距+分成三份后的宽+字体居中
            ctx.fillText("金额", $imgW / 3 * 3 - $margin - (parseInt($font) * 2), updateHeight(false));
            updateHeight(true, 5);

            // 收银总金额
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            for (var i = 0; i < data.orderList.length; i++) {
                var orderListLength = ctx.measureText(data.orderList[i].totalAmount.toFixed(2)).width;//订单金额的宽度
                ctx.fillText(data.orderList[i].name, $margin, updateHeight());
                ctx.fillText(data.orderList[i].totalCount, $margin + $imgW / 3 + (parseInt($font) * 2) / 2, updateHeight(false));
                ctx.fillText(data.orderList[i].totalAmount.toFixed(2), $margin + ($imgW - 40) / 3 * 2 + (($imgW - 40) / 3 - orderListLength), updateHeight(false));
            }

            //分界线
            ctx.beginPath();
            ctx.setLineDash([4, 1]);
            ctx.lineWidth = 1;
            ctx.moveTo(20, updateHeight());
            ctx.lineTo($imgW - 20, updateHeight(false));
            ctx.stroke();

            ctx.fillText("会员卡消费总额", ($imgW - parseInt($font) * 7) / 2, updateHeight());

            // 卡种名称+笔数+金额 的标题
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("卡种名称", $margin, updateHeight());
            ctx.fillText("笔数", $margin + $imgW / 3 + (parseInt($font) * 2) / 2, updateHeight(false));//左边的间距+分成三份后的宽+字体居中
            ctx.fillText("金额", $imgW / 3 * 3 - $margin - (parseInt($font) * 2), updateHeight(false));
            updateHeight(true, 5);

            // 会员卡消费总额
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            for (var i = 0; i < data.mbrCardSpec.length; i++) {
                var mbrCardSpecLength = ctx.measureText(data.mbrCardSpec[i].totalAmount.toFixed(2)).width;//订单金额的宽度
                ctx.fillText(data.mbrCardSpec[i].name, $margin, updateHeight());
                ctx.fillText(data.mbrCardSpec[i].totalCount, $margin + $imgW / 3 + (parseInt($font) * 2) / 2, updateHeight(false));
                ctx.fillText(data.mbrCardSpec[i].totalAmount.toFixed(2), $margin + ($imgW - 40) / 3 * 2 + (($imgW - 40) / 3 - mbrCardSpecLength), updateHeight(false));
            }

            //分界线
            ctx.beginPath();
            ctx.setLineDash([4, 1]);
            ctx.lineWidth = 1;
            ctx.moveTo(20, updateHeight());
            ctx.lineTo($imgW - 20, updateHeight(false));
            ctx.stroke();

            ctx.fillText("油品消费统计", ($imgW - parseInt($font) * 6) / 2, updateHeight());

            // 油品名称+升+笔数+金额 的标题
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("油品名称", $margin, updateHeight());
            ctx.fillText("升", $margin + $imgW / 4 + parseInt($font), updateHeight(false));//左边的间距+分成三份后的宽+字体居中
            ctx.fillText("笔数", $margin + $imgW / 4 * 2 + (parseInt($font) * 2) / 2, updateHeight(false));//左边的间距+分成三份后的宽+字体居中
            ctx.fillText("金额", $imgW / 4 * 4 - $margin - (parseInt($font) * 2), updateHeight(false));
            updateHeight(true, 5);

            // 油品消费统计
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            for (var i = 0; i < data.proSkuCount.length; i++) {
                var proSkuCountLength = ctx.measureText(data.proSkuCount[i].totalAmount.toFixed(2)).width;//订单金额的宽度
                ctx.fillText(data.proSkuCount[i].name.length>5?(data.proSkuCount[i].name.substr(0, 5).concat('...')):data.proSkuCount[i].name, $margin, updateHeight());
                ctx.fillText(data.proSkuCount[i].quantity, $margin + $imgW / 4 + parseInt($font), updateHeight(false));
                ctx.fillText(data.proSkuCount[i].totalCount, $margin + $imgW / 4 * 2 + (parseInt($font) * 2) / 2, updateHeight(false));
                ctx.fillText(data.proSkuCount[i].totalAmount.toFixed(2), $margin + ($imgW - 40) / 4 * 3 + (($imgW - 40) / 4 - proSkuCountLength), updateHeight(false));
            }

            //分界线
            ctx.beginPath();
            ctx.setLineDash([4, 1]);
            ctx.lineWidth = 1;
            ctx.moveTo(20, updateHeight());
            ctx.lineTo($imgW - 20, updateHeight(false));
            ctx.stroke();


            //订单金额
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("订单金额合计", $margin, updateHeight());
            var orderAmountLength = ctx.measureText(data.orderAmount.toFixed(2)).width;
            ctx.fillText(data.orderAmount.toFixed(2), ($imgW - 20) / 2 + Math.floor(($imgW - 20) / 2 - orderAmountLength), updateHeight(false));

            //优惠金额
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("优惠金额合计", $margin, updateHeight());
            var discountAmountLength = ctx.measureText(data.discountAmount.toFixed(2)).width;
            ctx.fillText(data.discountAmount.toFixed(2), ($imgW - 20) / 2 + Math.floor(($imgW - 20) / 2 - discountAmountLength), updateHeight(false));

            //实付金额
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("实付金额合计", $margin, updateHeight());
            var realPayAmountLength = ctx.measureText(data.realPayAmount.toFixed(2)).width;
            ctx.fillText(data.realPayAmount.toFixed(2), ($imgW - 20) / 2 + Math.floor(($imgW - 20) / 2 - realPayAmountLength), updateHeight(false));

            //分界线
            ctx.beginPath();
            ctx.setLineDash([4, 1]);
            ctx.lineWidth = 1;
            ctx.moveTo(20, updateHeight());
            ctx.lineTo($imgW - 20, updateHeight(false));
            ctx.stroke();


            //打印时间
            ctx.fillStyle = '#000';
            ctx.font = $font + $font_style;
            ctx.fillText("打印时间：" + format(new Date().getTime()), ($imgW - parseInt($font_shfit) * 11) / 2, updateHeight());

            //保存为图片
            shift.prototype.Canvas2Image.saveAsImage(canvas, $imgW, canvasHeight, $sel, data.userName);
        }
    }

    var tickets = new shift();
    tickets.drawCanvas2Img(downloadTicketsData);
}

export default signinTicket;