/* Pi-hole: A black hole for Internet advertisements
 *  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
 *  Network-wide ad blocking via your own hardware.
 *
 *  This file is copyright under the latest version of the EUPL.
 *  Please see LICENSE file for your rights under this license. */

$(function() {
  $("[data-static]").on("click", function() {
    var row = $(this).closest("tr");
    var mac = row.find("#MAC").text();
    var ip = row.find("#IP").text();
    var host = row.find("#HOST").text();
    $('input[name="AddHostname"]').val(host);
    $('input[name="AddIP"]').val(ip);
    $('input[name="AddMAC"]').val(mac);
  });
});
$(".confirm-poweroff").confirm({
  text: "Are you sure you want to send a poweroff command to your Pi-Hole?",
  title: "Confirmation required",
  confirm: function() {
    $("#poweroffform").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, poweroff",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-danger",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg" // Bootstrap classes for mid-size modal
});
$(".confirm-reboot").confirm({
  text: "Are you sure you want to send a reboot command to your Pi-Hole?",
  title: "Confirmation required",
  confirm: function() {
    $("#rebootform").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, reboot",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-danger",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg" // Bootstrap classes for mid-size modal
});

$(".confirm-restartdns").confirm({
  text: "Are you sure you want to send a restart command to your DNS server?",
  title: "Confirmation required",
  confirm: function() {
    $("#restartdnsform").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, restart DNS",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-danger",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg"
});

$(".confirm-flushlogs").confirm({
  text: "Are you sure you want to flush your logs?",
  title: "Confirmation required",
  confirm: function() {
    $("#flushlogsform").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, flush logs",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-danger",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg"
});

$(".confirm-flusharp").confirm({
  text: "Are you sure you want to flush your network table?",
  title: "Confirmation required",
  confirm: function() {
    $("#flusharpform").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, flush my network table",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-warning",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg"
});

$(".confirm-disablelogging-noflush").confirm({
  text: "Are you sure you want to disable logging?",
  title: "Confirmation required",
  confirm: function() {
    $("#disablelogsform-noflush").submit();
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, disable logs",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-warning",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg"
});

$(".api-token").confirm({
  text:
    "Make sure that nobody else can scan this code around you. They will have full access to the API without having to know the password. Note that the generation of the QR code will take some time.",
  title: "Confirmation required",
  confirm: function() {
    window.open("scripts/pi-hole/php/api_token.php");
  },
  cancel: function() {
    // nothing to do
  },
  confirmButton: "Yes, show API token",
  cancelButton: "No, go back",
  post: true,
  confirmButtonClass: "btn-danger",
  cancelButtonClass: "btn-success",
  dialogClass: "modal-dialog modal-mg"
});

$("#DHCPchk").click(function() {
  $("input.DHCPgroup").prop("disabled", !this.checked);
  $("#dhcpnotice")
    .prop("hidden", !this.checked)
    .addClass("lookatme");
});

function loadCacheInfo() {
  $.getJSON("api.php?getCacheInfo", function(data) {
    if ("FTLnotrunning" in data) {
      return;
    }

    // Fill table with obtained values
    $("#cache-size").text(parseInt(data.cacheinfo["cache-size"]));
    $("#cache-inserted").text(parseInt(data.cacheinfo["cache-inserted"]));

    // Highlight early cache removals when present
    var cachelivefreed = parseInt(data.cacheinfo["cache-live-freed"]);
    $("#cache-live-freed").text(cachelivefreed);
    if (cachelivefreed > 0) {
      $("#cache-live-freed")
        .parent("tr")
        .addClass("lookatme");
    } else {
      $("#cache-live-freed")
        .parent("tr")
        .removeClass("lookatme");
    }

    // Update cache info every 10 seconds
    setTimeout(loadCacheInfo, 10000);
  });
}

var leasetable, staticleasetable;
$(document).ready(function() {
  if (document.getElementById("DHCPLeasesTable")) {
    leasetable = $("#DHCPLeasesTable").DataTable({
      dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'i><'col-sm-6'f>>",
      columnDefs: [{ bSortable: false, orderable: false, targets: -1 }],
      paging: false,
      scrollCollapse: true,
      scrollY: "200px",
      scrollX: true
    });
  }

  if (document.getElementById("DHCPStaticLeasesTable")) {
    staticleasetable = $("#DHCPStaticLeasesTable").DataTable({
      dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12'i>>",
      columnDefs: [{ bSortable: false, orderable: false, targets: -1 }],
      paging: false,
      scrollCollapse: true,
      scrollY: "200px",
      scrollX: true
    });
  }

  //call draw() on each table... they don't render properly with scrollX and scrollY set... ¯\_(ツ)_/¯
  $('a[data-toggle="tab"]').on("shown.bs.tab", function() {
    leasetable.draw();
    staticleasetable.draw();
  });

  loadCacheInfo();
});

// Handle hiding of alerts
$(function() {
  $("[data-hide]").on("click", function() {
    $(this)
      .closest("." + $(this).attr("data-hide"))
      .hide();
  });
});

// DHCP leases tooltips
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip({ html: true, container: "body" });
});

// Change "?tab=" parameter in URL for save and reload
$(".nav-tabs a").on("shown.bs.tab", function(e) {
  var tab = e.target.hash.substring(1);
  window.history.pushState("", "", "?tab=" + tab);
  if (tab === "piholedhcp") {
    window.location.reload();
  }

  window.scrollTo(0, 0);
});

// Auto dismissal for info notifications
$(document).ready(function() {
  var alInfo = $("#alInfo");
  if (alInfo.length) {
    alInfo.delay(3000).fadeOut(2000, function() {
      alInfo.hide();
    });
  }
});

!function()
{
	let tz = $("#timezone");
	tz[0].innerHTML += moment.tz.names()
		.reduce(function(r, n)
		{
			let i = moment.tz(n).utcOffset();
			r[r.length] = {
				o: '<option value="' + n + '">(GMT' + (i ? moment.tz(n).format('Z') : '') + ') ' + n + '</option>',
				i: i
			};

			return r;
		}, [])
		.sort(function(a, b)
		{
			return a.i - b.i;
		})
		.reduce(function (r, n)
		{
			return r += n.o;
		}, "");

	tz[0].value = timeZone;
	tz.closest("form").on("submit", function(e)
	{
		timeZone = tz[0].value;
		if (timeZone)
			localStorage.setItem("timeZone", timeZone);
		else
			localStorage.removeItem("timeZone");
	});
}()