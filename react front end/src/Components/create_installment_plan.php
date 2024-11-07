<?php
session_start();
require("php_con.php");
if(!isset($_COOKIE['user_id'])){
    echo "<script>window.location='logout';</script>";
    exit();
}

$edit_mode = false;
$plan_id = null;
$plan = null;

if (isset($_GET['edit']) && is_numeric($_GET['edit'])) {
    $edit_mode = true;
    $plan_id = $_GET['edit'];
    
    // Fetch the plan details
    $stmt = $connation->prepare("SELECT ip.*, c.cs_name, p.product_name FROM installment_plans ip 
                                 JOIN customer_details c ON ip.cs_id = c.cs_id 
                                 JOIN product_details p ON ip.product_id = p.product_id
                                 WHERE ip.plan_id = ?");
    $stmt->bind_param("i", $plan_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $plan = $result->fetch_assoc();

    if (!$plan) {
        echo "<div class='alert alert-danger'>Error: Plan not found.</div>";
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customer_id = $_POST['customer_id'];
    $product_id = $_POST['product_id'];
    $total_amount = $_POST['total_amount'];
    $duration_months = $_POST['duration_months'];
    $interest_rate = ($_POST['interest_rate'] ?? 0) / 100;

    // Validate customer_id
    $stmt = $connation->prepare("SELECT cs_id FROM customer_details WHERE cs_id = ?");
    $stmt->bind_param("i", $customer_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo "<div class='alert alert-danger'>Error: Invalid customer ID.</div>";
    } else {
        // Get product name
        $stmt = $connation->prepare("SELECT product_name FROM product_details WHERE product_id = ?");
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();
        $product_name = $product['product_name'];

        if ($edit_mode) {
            // Fetch current plan details
            $stmt = $connation->prepare("SELECT remaining_balance, duration_months FROM installment_plans WHERE plan_id = ?");
            $stmt->bind_param("i", $plan_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $current_plan = $result->fetch_assoc();

            $remaining_balance = $current_plan['remaining_balance'];
            $remaining_months = $duration_months - ($current_plan['duration_months'] - $plan['remaining_months']);

            // Calculate new remaining balance with added interest
            $new_remaining_balance = $remaining_balance * (1 + $interest_rate * ($remaining_months / 12));

            // Calculate new monthly payment
            $new_monthly_payment = $new_remaining_balance / $remaining_months;

            // Update existing plan
            $stmt = $connation->prepare("UPDATE installment_plans SET cs_id = ?, product_id = ?, product_name = ?, total_amount = ?, duration_months = ?, monthly_payment = ?, remaining_balance = ?, interest_rate = ?, remaining_months = ? WHERE plan_id = ?");
            $stmt->bind_param("iisdidddii", $customer_id, $product_id, $product_name, $total_amount, $duration_months, $new_monthly_payment, $new_remaining_balance, $interest_rate, $remaining_months, $plan_id);
            if ($stmt->execute()) {
                echo "<div class='alert alert-success'>Installment Plan Updated Successfully!</div>";
            } else {
                echo "<div class='alert alert-danger'>Error updating installment plan: " . $stmt->error . "</div>";
            }
        } else {
            // Calculate monthly payment and first payment for new plan
            $first_payment = 0;
            $remaining_balance = $total_amount - $first_payment;

            // Calculate total interest and add it to the remaining balance
            $total_interest = $remaining_balance * $interest_rate * ($duration_months / 12);
            $remaining_balance_with_interest = $remaining_balance + $total_interest;

            $monthly_payment = $remaining_balance_with_interest / $duration_months;

            // Insert new plan
                        // Insert new plan
                        $stmt = $connation->prepare("INSERT INTO installment_plans (cs_id, product_id, product_name, total_amount, duration_months, monthly_payment, first_payment, remaining_balance, interest_rate, start_date, remaining_months) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)");
                        $stmt->bind_param("iisdiidddi", $customer_id, $product_id, $product_name, $total_amount, $duration_months, $monthly_payment, $first_payment, $remaining_balance_with_interest, $interest_rate, $duration_months);
                        if ($stmt->execute()) {
                            echo "<div class='alert alert-success'>Installment Plan Created Successfully!</div>";
                        } else {
                            echo "<div class='alert alert-danger'>Error creating installment plan: " . $stmt->error . "</div>";
                        }
                    }
                }
            }
            
            require("header.php");
            ?>
            
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <title><?php echo $edit_mode ? 'Edit' : 'Create'; ?> Installment Plan</title>
            </head>
            <body>
            <?php include 'navbar.php'; ?>
            <div class="container mt-5">
                <h2><?php echo $edit_mode ? 'Edit' : 'Create'; ?> Installment Plan</h2>
                <form action="<?php echo $edit_mode ? "create_installment_plan.php?edit=$plan_id" : 'create_installment_plan.php'; ?>" method="POST">
                    <div class="form-group">
                        <label for="customer_search">Search Customer:</label>
                        <input type="text" class="form-control" id="customer_search" placeholder="Enter name or phone number" <?php if ($edit_mode) echo "value='".$plan['cs_name']."'"; ?>>
                        <div id="customer_results"></div>
                    </div>
                    <input type="hidden" id="customer_id" name="customer_id" required <?php if ($edit_mode) echo "value='".$plan['cs_id']."'"; ?>>
                    
                    <div class="form-group">
                        <label for="product_id">Product ID:</label>
                        <input type="number" class="form-control" id="product_id" name="product_id" placeholder="Enter Product ID" required <?php if ($edit_mode) echo "value='".$plan['product_id']."'"; ?>>
                    </div>
            
                    <div class="form-group">
                        <label for="amount">Total Amount:</label>
                        <input type="number" step="0.01" class="form-control" id="amount" name="total_amount" required <?php if ($edit_mode) echo "value='".$plan['total_amount']."'"; ?>>
                    </div>
                    <div class="form-group">
                        <label for="months">Duration (Months):</label>
                        <input type="number" class="form-control" id="months" name="duration_months" required <?php if ($edit_mode) echo "value='".$plan['duration_months']."'"; ?>>
                    </div>
                    <div class="form-group">
                        <label for="interest">Interest Rate (% per year):</label>
                        <input type="number" step="0.01" class="form-control" id="interest" name="interest_rate" <?php echo $edit_mode ? "value='".($plan['interest_rate'] * 100)."'" : "value='0'"; ?>>
                    </div>
                    <div class="form-group">
                        <label>Monthly Payment Amount:</label>
                        <p id="monthly_payment_amount">LKR <?php echo $edit_mode ? number_format($plan['monthly_payment'], 2) : '0.00'; ?></p>
                    </div>
                    <div class="form-group">
                        <label>Total Amount to Pay (with interest):</label>
                        <p id="total_amount_with_interest">LKR <?php echo $edit_mode ? number_format($plan['monthly_payment'] * $plan['duration_months'], 2) : '0.00'; ?></p>
                    </div>
                    <button type="submit" class="btn btn-primary"><?php echo $edit_mode ? 'Update' : 'Create'; ?> Plan</button>
                </form>
            
                <h3 class="mt-5">Current Payment Plans</h3>
                <div class="form-group">
                <input type="text" class="form-control" id="plan_search" placeholder="Search by customer name or phone number">
    </div>
    <table class="table table-striped" id="plans_table">
        <thead>
            <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Total Amount</th>
                <th>Monthly Payment</th>
                <th>Remaining Balance</th>
                <th>Remaining Months</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $query = $connation->query("SELECT ip.*, c.cs_name, c.cs_mobile FROM installment_plans ip JOIN customer_details c ON ip.cs_id = c.cs_id WHERE ip.status = 'active' ORDER BY ip.start_date DESC");
            while ($row = $query->fetch_assoc()) {
                echo "<tr>
                        <td>{$row['cs_name']}</td>
                        <td>{$row['cs_mobile']}</td>
                        <td>{$row['product_name']}</td>
                        <td>LKR " . number_format($row['total_amount'], 2) . "</td>
                        <td>LKR " . number_format($row['monthly_payment'], 2) . "</td>
                        <td>LKR " . number_format($row['remaining_balance'], 2) . "</td>
                        <td>{$row['remaining_months']}</td>
                        <td>
                            <a href='create_installment_plan.php?edit={$row['plan_id']}' class='btn btn-sm btn-primary'>Edit</a>
                        </td>
                    </tr>";
            }
            ?>
        </tbody>
    </table>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
$(document).ready(function() {
    $('#customer_search').on('input', function() {
        var search = $(this).val();
        if(search != "") {
            $.ajax({
                url: "search_customer.php",
                method: "POST",
                data: {query:search},
                success: function(data) {
                    $('#customer_results').html(data);
                }
            });
        } else {
            $('#customer_results').html('');
        }
    });

    $(document).on('click', '.customer_item', function() {
        $('#customer_search').val($(this).text());
        $('#customer_id').val($(this).data('id'));
        $('#customer_results').html('');
    });

    $('#product_id').on('input', function() {
        var productId = $(this).val();
        if(productId != "") {
            $.ajax({
                url: "get_product_details.php", // A new PHP file to fetch product details
                method: "POST",
                data: {product_id: productId},
                success: function(data) {
                    var product = JSON.parse(data);
                    if (product) {
                        $('#amount').val(product.price); // Assuming 'price' is returned
                        updateCalculations();
                    } else {
                        $('#amount').val(0);
                    }
                }
            });
        } else {
            $('#amount').val(0);
        }
    });

    function updateCalculations() {
        var totalAmount = parseFloat($('#amount').val()) || 0;
        var months = parseInt($('#months').val()) || 1;
        var yearlyInterestRate = parseFloat($('#interest').val()) || 0;

        var monthlyInterestRate = yearlyInterestRate / 12 / 100;

        var monthlyPayment;
        if (monthlyInterestRate === 0) {
            monthlyPayment = totalAmount / months;
        } else {
            var powerFactor = Math.pow(1 + monthlyInterestRate, months);
            monthlyPayment = (totalAmount * monthlyInterestRate * powerFactor) / (powerFactor - 1);
        }

        var totalAmountWithInterest = monthlyPayment * months;

        $('#monthly_payment_amount').text('LKR ' + monthlyPayment.toFixed(2));
        $('#total_amount_with_interest').text('LKR ' + totalAmountWithInterest.toFixed(2));
    }

    $('#amount, #months, #interest').on('input', function() {
        updateCalculations();
    });

    updateCalculations();

    // New code for searching current payment plans
    $('#plan_search').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $("#plans_table tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
</script>
</body>
</html>