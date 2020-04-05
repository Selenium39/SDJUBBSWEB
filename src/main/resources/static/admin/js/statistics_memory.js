var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting() {
    show();
}

function show() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    var data = (function () {
        var datas = [];
        $.ajax({
            type: "get",
            url: URL + '/api/admin/statistics/memory/info',
            async: false,
            data: {
                name: '' + name,
                sessionId: '' + sessionId,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var used = (((result.data.infos.used / result.data.infos.total).toFixed(2)) * 100);
                datas.push({
                    "name": "已使用 " + used + '%',
                    "value": result.data.infos.used,
                });
                datas.push({
                    "name": "未使用" + (100 - used) + '%',
                    "value": result.data.infos.free,
                });
            }
        })
        return datas;
        //]]>
    })()
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '内存信息统计',
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '内存信息',
                type: 'pie',
                radius: '80%',
                data: data,
                label: {
                    show: true,
                    position: 'outside',
                    format: '{c},({d}%)',
                    textStyle: {
                        color: 'black',
                        fontSize: 15
                    }
                }
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}




