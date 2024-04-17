$(document).ready(function () {
    $("#voltarName").click(function () {
        $("#containerName").show();
        $("#containerDTA").hide();
        $("#containerSenha").hide();
    });

    $("#btnCadNome").click(function () {
        $("#containerName").hide();
        $("#containerDTA").show();
        $("#containerSenha").hide();
    });

    $("#voltarData").click(function () {
        $("#containerName").show();
        $("#containerDTA").hide();
        $("#containerSenha").hide();
    });

    $("#btnCadData").click(function () {
        $("#containerName").hide();
        $("#containerDTA").hide();
        $("#containerSenha").show();
    });

    $("#voltarSenha").click(function () {
        $("#containerName").hide();
        $("#containerDTA").show();
        $("#containerSenha").hide();
    });
});


