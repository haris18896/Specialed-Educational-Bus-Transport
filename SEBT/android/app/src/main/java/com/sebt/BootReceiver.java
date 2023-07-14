package com.sebt;

import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            // Request SYSTEM_ALERT_WINDOW permission
            if (!Settings.canDrawOverlays(context)) {
                Intent permissionIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + context.getPackageName()));
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
            }

            // Request DISABLE_KEYGUARD permission
            DevicePolicyManager devicePolicyManager = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);
            if (devicePolicyManager != null && !devicePolicyManager.isAdminActive(new ComponentName(context, YourDeviceAdminReceiver.class))) {
                Intent permissionIntent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
                permissionIntent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, new ComponentName(context, YourDeviceAdminReceiver.class));
                permissionIntent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Enable this permission to disable the keyguard.");
                permissionIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(permissionIntent);
            }

            // Your other code for handling the boot completion event
            Intent myIntent = new Intent(context, MainActivity.class);
            myIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(myIntent);
        }
    }
}
