# Google Ads Integration Guide

This guide explains how to configure and manage Google Ads on the SnapInsta application.

## Prerequisites

- A [Google AdSense](https://adsense.google.com/) account.
- Your website must be approved by AdSense.

## Configuration

### 1. Script Installation

The Google AdSense script must be included in the `<head>` of your `client/index.html` file.

```html
<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID_HERE"
  crossorigin="anonymous">
</script>
```

### 2. Environment Variables

You also need to configure your Google Ads Client ID in the `.env` file for the components to function correctly.

1.  Open `client/.env`.
2.  Add or update the `VITE_GOOGLE_ADS_CLIENT_ID` variable:

```env
VITE_GOOGLE_ADS_CLIENT_ID=ca-pub-YOUR_CLIENT_ID_HERE
```

**Note:** In development mode (`npm run dev`), the ads will show as placeholders to prevent invalid traffic activity on your account.

### 3. Ad Components

The project uses a reusable `GoogleAd` component located in `client/src/components/GoogleAd.tsx` to display ads. The component checks for the presence of the global `adsbygoogle` object.

#### Usage

```tsx
import { GoogleAd } from "@/components/GoogleAd";

// ...

<GoogleAd 
  slot="1234567890" 
  className="w-full max-w-[728px] h-[90px]" 
  format="auto"
/>
```

#### Properites

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slot` | `string` | **Required** | The Ad Unit ID from your AdSense dashboard. |
| `className` | `string` | `undefined` | CSS classes for wrapper styling. |
| `style` | `object` | `undefined` | Inline styles for wrapper. |
| `format` | `string` | `'auto'` | Ad format ('auto', 'fluid', 'rectangle'). |
| `responsive` | `boolean` | `true` | Whether the ad is responsive. |
| `layoutKey` | `string` | `undefined` | Optional layout key for In-feed ads. |

### 4. Adding New Ad Units

1.  Go to your AdSense dashboard > **Ads** > **By ad unit**.
2.  Create a new display ad unit.
3.  Copy the `data-ad-slot` number.
4.  Place the `<GoogleAd />` component where you want it to appear and pass the slot ID.

### 5. Locations

Currently, ads are placed in:

-   **Home Page (`client/src/pages/Index.tsx`)**:
    -   Below the download result card.
    -   Between the hero section and features section.

## Verification

To verify ads are working:

1.  Ensure `VITE_GOOGLE_ADS_CLIENT_ID` is set in `.env`.
2.  Run the app: `npm run dev`.
3.  You should see "Google Ad Placeholder" boxes in the configured locations.
4.  In production (after building), the actual scripts will load and display ads.

## Troubleshooting

-   **Ads not showing?**
    -   Check if your AdSense account is approved.
    -   Check if the domain is added to your 'Sites' list in AdSense.
    -   Ensure `ads.txt` is properly configured on your server (hosted at `yourdomain.com/ads.txt`).
    -   Wait up to 48 hours for new ad units to become active.

-   **Script errors in console?**
    -   Ensure you haven't blocked 3rd party scripts with an ad blocker extension.
