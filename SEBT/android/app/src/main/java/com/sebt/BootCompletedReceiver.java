package com.sebt;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootCompletedReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
            // Start your React Native activity or perform necessary actions
            Intent reactNativeIntent = new Intent(context, MainActivity.class);
            reactNativeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(reactNativeIntent);
        }
    }
}
