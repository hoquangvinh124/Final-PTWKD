# AWS Location Service Setup Guide

This guide will help you set up AWS Location Service API keys for the GPS address detection feature in your application.

## Overview

AWS Location Service provides high-accuracy reverse geocoding with detailed address components, including exact house numbers. This guide covers:
- Creating an AWS account
- Setting up AWS Location Service
- Generating API keys
- Configuring your application
- Pricing and free tier information

---

## Step 1: Create an AWS Account

1. Go to [AWS Console](https://aws.amazon.com/)
2. Click **Create an AWS Account**
3. Follow the registration process:
   - Enter your email and password
   - Provide contact information
   - Enter payment information (required, but you can use free tier)
   - Complete phone verification
4. Sign in to your new AWS account

---

## Step 2: Enable AWS Location Service

### 2.1 Access AWS Location Service

1. Sign in to [AWS Console](https://console.aws.amazon.com/)
2. In the search bar at the top, type **"Location Service"**
3. Click on **AWS Location Service**

### 2.2 Choose Your Region

AWS Location Service is available in specific regions. Choose a region close to your users:
- **Asia Pacific (Singapore)**: `ap-southeast-1` (recommended for Vietnam)
- **US East (N. Virginia)**: `us-east-1` (most services available)
- **Europe (Frankfurt)**: `eu-central-1`
- **Asia Pacific (Tokyo)**: `ap-northeast-1`

**Note:** Remember your selected region - you'll need it in your code configuration!

---

## Step 3: Create an API Key

### 3.1 Navigate to API Keys

1. In AWS Location Service console, click **API keys** in the left sidebar
2. Click **Create API key**

### 3.2 Configure the API Key

1. **API key name**: Enter a descriptive name (e.g., `OldieZone-GPS-Key`)

2. **Allowed operations**: Select the following:
   - ✅ **Search** (for reverse geocoding)
   - You can leave other options unchecked unless needed

3. **Resources**: Choose **All resources** for simplicity, or select specific place indexes if you want more control

4. **Restrictions** (Optional but Recommended):
   - **HTTP referrers**: Add your website domains
     ```
     https://yourdomain.com/*
     http://localhost:*
     ```
   - This prevents unauthorized use of your API key

5. Click **Create API key**

### 3.3 Save Your API Key

⚠️ **IMPORTANT**: Copy your API key immediately and save it securely. AWS shows it only once!

```
Example API key: v1.public.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Step 4: Configure Your Application

### 4.1 Update `geolocation.js`

Open `/assets/js/geolocation.js` and update the AWS configuration:

```javascript
const AWS_CONFIG = {
  apiKey: 'v1.public.YOUR_ACTUAL_API_KEY_HERE', // Paste your API key here
  region: 'ap-southeast-1', // Your selected AWS region
  language: 'vi' // Language for address results (Vietnamese)
};
```

### 4.2 Test the Configuration

1. Open your application in a browser
2. Navigate to **User Profile** → **Shipping Address** tab
3. Click **"Use My Current Location (GPS)"**
4. Check the browser console for:
   ```
   AWS Location Service SDK loaded successfully
   AWS Reverse Geocoding Request: {...}
   AWS Geocoding Response: {...}
   Detailed address filled: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7"
   ```

---

## Step 5: Understanding AWS Location Service Pricing

### Free Tier (First 12 Months)

AWS offers a **Free Tier** for new accounts:
- **50,000 requests per month** for reverse geocoding
- Applies for the first 12 months after AWS account creation

### After Free Tier / Regular Pricing

After the free tier expires:
- **Search operations** (reverse geocoding): **$5.00 per 1,000 requests**
- Example costs:
  - 1,000 requests/month = $5.00/month
  - 10,000 requests/month = $50.00/month

### Cost Optimization Tips

1. **Cache Results**: Store GPS results in localStorage to avoid repeated requests
2. **Rate Limiting**: Implement debouncing for GPS button clicks
3. **Fallback**: Use OpenStreetMap (free) when API key is not available
4. **Monitoring**: Set up AWS billing alerts at $5, $10, $20 thresholds

---

## Step 6: Security Best Practices

### 6.1 Restrict API Key Usage

Always configure restrictions on your API keys:

1. **HTTP Referrer Restrictions**:
   ```
   https://yourdomain.com/*
   https://*.yourdomain.com/*
   http://localhost:*
   ```

2. **IP Address Restrictions** (for server-side usage):
   - Add your server's IP addresses

### 6.2 Monitor API Usage

1. Go to **AWS CloudWatch** in the AWS Console
2. Set up metrics to monitor:
   - Request count
   - Error rate
   - Costs

3. Create billing alarms:
   - Navigate to **AWS Billing** → **Billing Preferences**
   - Enable **Receive Billing Alerts**
   - Set thresholds (e.g., $10, $50, $100)

### 6.3 Rotate API Keys Regularly

- Create a new API key every 3-6 months
- Update your application with the new key
- Delete the old key after migration

---

## Troubleshooting

### Issue: "AWS API key not configured, falling back to OpenStreetMap"

**Solution**: Check that your API key is correctly set in `geolocation.js`:
```javascript
apiKey: 'v1.public.YOUR_KEY_HERE', // Must not be 'YOUR_AWS_API_KEY_HERE'
```

### Issue: "Access Denied" or CORS errors

**Solution**:
1. Check your API key restrictions in AWS Console
2. Ensure your domain is in the allowed HTTP referrers list
3. For local testing, add `http://localhost:*`

### Issue: "No address found for this location"

**Solution**:
1. AWS Location Service may not have data for remote/rural areas
2. The application will automatically fall back to OpenStreetMap
3. Check console logs to see which service was used

### Issue: "InvalidAccessKeyId" error

**Solution**:
1. Verify you copied the complete API key (starts with `v1.public.`)
2. Ensure the API key hasn't been deleted in AWS Console
3. Check if your AWS account is active and not suspended

### Issue: Unexpected charges

**Solution**:
1. Check **AWS Cost Explorer** to see request patterns
2. Look for unusual spike in requests (possible bot/scraper)
3. Enable stricter API key restrictions
4. Consider implementing request rate limiting in your app

---

## AWS Location Service vs Google Maps

### Advantages of AWS Location Service:
- ✅ **50,000 free requests/month** (first 12 months)
- ✅ AWS infrastructure and reliability
- ✅ Integration with other AWS services
- ✅ Detailed billing and usage analytics

### Comparison:
| Feature | AWS Location | Google Maps |
|---------|--------------|-------------|
| Free Tier | 50,000/month (12 months) | 28,500/month (forever) |
| Pricing After | $5 per 1,000 requests | $5 per 1,000 requests |
| Data Provider | HERE, Esri | Google |
| Vietnam Coverage | Good | Excellent |
| Setup Complexity | Medium | Easy |

---

## Alternative: Using OpenStreetMap (Always Free)

If you want a completely free solution without API keys:

1. In `geolocation.js`, set:
   ```javascript
   apiKey: 'YOUR_AWS_API_KEY_HERE', // Leave as is
   ```

2. The system will automatically use **OpenStreetMap Nominatim**:
   - ✅ Completely free
   - ✅ No API key required
   - ✅ No request limits
   - ⚠️ Less accurate house numbers in Vietnam
   - ⚠️ Slower response times

---

## Additional Resources

- **AWS Location Service Documentation**: https://docs.aws.amazon.com/location/
- **AWS Location Service Pricing**: https://aws.amazon.com/location/pricing/
- **API Reference**: https://docs.aws.amazon.com/location/latest/APIReference/
- **AWS Free Tier Details**: https://aws.amazon.com/free/
- **AWS Support**: https://console.aws.amazon.com/support/

---

## Quick Start Checklist

- [ ] Create AWS account
- [ ] Enable AWS Location Service
- [ ] Choose your region (e.g., `ap-southeast-1`)
- [ ] Create API key with Search permissions
- [ ] Copy and save API key securely
- [ ] Update `geolocation.js` with your API key and region
- [ ] Configure HTTP referrer restrictions
- [ ] Test GPS functionality in your app
- [ ] Set up billing alerts
- [ ] Monitor usage in AWS CloudWatch

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review AWS CloudWatch Logs for API errors
3. Verify your API key permissions in AWS Console
4. Contact AWS Support for account-related issues

---

**Last Updated**: 2025-11-05
**Version**: 1.0
