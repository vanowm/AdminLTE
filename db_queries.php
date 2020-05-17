<?php /*
*    Pi-hole: A black hole for Internet advertisements
*    (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*    Network-wide ad blocking via your own hardware.
*
*    This file is copyright under the latest version of the EUPL.
*    Please see LICENSE file for your rights under this license. */
    require "scripts/pi-hole/php/header.php";

// Generate CSRF token
if(empty($_SESSION['token'])) {
    $_SESSION['token'] = base64_encode(openssl_random_pseudo_bytes(32));
}
$token = $_SESSION['token'];

?>
<!-- Send PHP info to JS -->
<div id="token" hidden><?php echo $token ?></div>

<!-- Title -->
<div class="page-header">
    <h1>Specify date range to be queried from the Pi-hole query database</h1>
</div>


<div class="row">
    <div class="col-md-12">
<!-- Date Input -->
      <div class="form-group">
        <label>Date and time range:</label>

        <div class="input-group">
          <div class="input-group-addon">
            <i class="far fa-clock"></i>
          </div>
          <input type="button" class="form-control pull-right" id="querytime" value="Click to select date and time range">
        </div>
        <!-- /.input group -->
      </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <label>Query status:</label>
    </div>
    <div class="form-group">
        <div class="col-md-3">
            <div class="checkbox">
                <label><input type="checkbox" id="type_forwarded" checked><strong>Permitted: </strong>forwarded</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="type_cached" checked><strong>Permitted: </strong>cached</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="checkbox">
                <label><input type="checkbox" id="type_gravity" checked><strong>Blocked: </strong>gravity</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="type_external" checked><strong>Blocked: </strong>external</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="checkbox">
                <label><input type="checkbox" id="type_blacklist" checked><strong>Blocked: </strong>exact blacklist</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="type_regex" checked><strong>Blocked: </strong>regex blacklist</label>
            </div>
        </div>
        <div class="col-md-3">
            <div class="checkbox">
                <label><input type="checkbox" id="type_gravity_CNAME" checked><strong>Blocked: </strong>gravity (CNAME)</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="type_blacklist_CNAME" checked><strong>Blocked: </strong>exact blacklist (CNAME)</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="type_regex_CNAME" checked><strong>Blocked: </strong>regex blacklist (CNAME)</label>
            </div>
        </div>
    </div>
</div>

<div id="timeoutWarning" class="alert alert-warning alert-dismissible fade in" role="alert" hidden="true">
    Depending on how large of a range you specified, the request may time out while Pi-hole tries to retrieve all the data.<br/><span id="err"></span>
</div>

<!-- Small boxes (Stat box) -->
<div class="row">
    <div class="col-lg-3 col-xs-12">
        <!-- small box -->
        <div class="small-box bg-aqua">
            <div class="inner">
                <h3 class="statistic" id="ads_blocked_exact">---</h3>
                <p>Queries Blocked</p>
            </div>
            <div class="icon">
                <i class="fas fa-hand-paper"></i>
            </div>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-xs-12">
        <!-- small box -->
        <div class="small-box bg-aqua">
            <div class="inner">
                <h3 class="statistic" id="ads_wildcard_blocked">---</h3>
                <p>Queries Blocked (Wildcards)</p>
            </div>
            <div class="icon">
                <i class="fas fa-hand-paper"></i>
            </div>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-xs-12">
        <!-- small box -->
        <div class="small-box bg-green">
            <div class="inner">
                <h3 class="statistic" id="dns_queries">---</h3>
                <p>Queries Total</p>
            </div>
            <div class="icon">
                <i class="fas fa-globe-americas"></i>
            </div>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-xs-12">
        <!-- small box -->
        <div class="small-box bg-yellow">
            <div class="inner">
                <h3 class="statistic" id="ads_percentage_today">---</h3>
                <p>Queries Blocked</p>
            </div>
            <div class="icon">
                <i class="fas fa-chart-pie"></i>
            </div>
        </div>
    </div>
    <!-- ./col -->
</div>

<div class="row">
    <div class="col-md-12">
      <div class="box" id="recent-queries">
        <div class="box-header with-border">
          <h3 class="box-title">Recent Queries</h3>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
            <table id="all-queries" class="display table table-striped table-bordered" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Domain</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Domain</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
    </div>
</div>
<!-- /.row -->

<script src="scripts/vendor/daterangepicker.js"></script>
<script src="scripts/pi-hole/js/db_queries.js"></script>

<?php
    require "scripts/pi-hole/php/footer.php";
?>
