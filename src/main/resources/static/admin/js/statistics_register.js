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

    // 指定图表的配置项和数据
    option = {
        title: {
            text: '最近注册用户',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: (function () {
                var datas = [];
                $.ajax({
                    type: "get",
                    url: URL + '/api/admin/statistics/register/info',
                    //这里一定要设置为false
                    async:false,
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                        num: $("#num").val()
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        $.each(result.data.infos, function (index, info) {
                            datas.push(info.time);
                        });
                    }
                })
                return datas;
            })(),
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} 人'
            },
            axisPointer: {
                snap: true
            }
        },
        series: [
            {
                name: '注册人数',
                type: 'line',
                smooth: true,
                data: (function () {
                    var datas = [];
                    $.ajax({
                        type: "get",
                        url: URL + '/api/admin/statistics/register/info',
                        async:false,
                        data: {
                            name: '' + name,
                            sessionId: '' + sessionId,
                            num: $("#num").val()
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (result) {
                            $.each(result.data.infos, function (index,info) {
                                datas.push(info.num);
                            });
                        }
                    })
                    return datas;
                })(),
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}




