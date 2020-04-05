var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting() {
    show();
    $("#num").change(function(){
        show();
    });
}

function show() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var data = (function () {
        var datas = [];
        $.ajax({
            type: "get",
            url: URL + '/api/admin/statistics/cpu/info',
            async: false,
            data: {
                name: '' + name,
                sessionId: '' + sessionId,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var length = result.data.infos.length;
                //console.log("length: "+length);
                $("#num").attr("max", length);
                var value = $("#num").val();
                if (value > length) {
                    value = 1;
                }
                var cpuInfo = result.data.infos[value - 1];
                var userUsed = cpuInfo.userUsed;
                var systemUsed = cpuInfo.systemUsed;
                var wait = cpuInfo.wait;
                var error = cpuInfo.error;
                var free = cpuInfo.free;

                datas.push({
                    "name": "用户使用率 " + userUsed,
                    "value": userUsed.split("%")[0],
                });
                datas.push({
                    "name": "系统使用率 " + systemUsed,
                    "value": systemUsed.split("%")[0],
                });
                datas.push({
                    "name": "系统等待率 " + wait,
                    "value": wait.split("%")[0],
                });
                datas.push({
                    "name": "系统错误率 " + error,
                    "value": error.split("%")[0],
                });
                datas.push({
                    "name": "系统空闲率 " + free,
                    "value": free.split("%")[0],
                });
            }
        })
        return datas;
        //]]>
    })()
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'CPU信息统计',
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        series: [
            {
                name: 'CPU信息',
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




