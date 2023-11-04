# Excito LLC Table of Contents Plugin


## Overview

Welcome to the **Squarespace Table of Contents Plugin** by Excito LLC! This tool is crafted with love for photographers, creatives, and all Squarespace users. If you've wanted a table of contents for your blog post to improve your user experience, this plugin is actually what you need.

> **Requirement:** [Requires a Squarespace plan that supports Javascript](https://support.squarespace.com/hc/en-us/articles/205815928-Adding-custom-code-to-your-site#toc-ways-to-add-custom-code?target=_blank).


## Why Use Excito’s Table of Contents Plugin?

1. **Enhanced User Experience:** Elevate the user experience of your blog readers with an interactive and easy-to-navigate table of contents, allowing them to find and jump to the relevant sections quickly.
2. **Mobile-Friendly:** Our plugin ensures that the table of contents is not only responsive but also optimized for mobile devices, providing a seamless experience for your readers on smartphones and tablets.
3. **No Coding Required:** Our plugin is tailor-made for those who prefer avoiding code editors. It's straightforward, intuitive, and efficient. With easy instructions to update/adjust colors.
4. **Integrate with Ease:** With our JavaScript snippet, effortlessly embed the plugin into any Squarespace design.



## How to Use

**Integrate the Plugin:**
   - Copy the below code.
   ```html
   <!-- Excito LLC | License: https://excitollc.com/squarespace-plugins/squarespace-table-of-contents-plugin -->
   <script>
      const EXC_BLOG_PAGE_TOC_PLUGIN_CONFIG = {
        // The plugin allows you to easily set the color of the Table of Contents section
        // by default it takes the colors of the announement bar
        // but it can be set to any of the 10 theme color categories
        theme: null, // "null", "white", "white-bold", "light", "light-bold", "bright-inverse", "bright", "dark", "dark-bold", "black", "black-bold" (correspond to the colors in the Squarespace editor)
        outlineHeaderName: "Outline", // The title at the top of the Table of Contents
        scope: "article", // "article" if you only want the headers in the post / "body" if you want all headers
        // Which headers to include in the outline (default is h1 and h2)
        headers: {
            h1: true,
            h2: true,
            h3: false,
            h4: false,
            h5: false,
            h6: false
        },
      };
   </script>
   <!-- You do not have to include jQuery if you have already included it in the full website code injection -->
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Excito-LLC/squarespace-plugins@main/plugins/table-of-contents-plugin/plugin.min.css" />
   <script src="https://cdn.jsdelivr.net/gh/Excito-LLC/squarespace-plugins@main/plugins/table-of-contents-plugin/plugin.min.js"></script>
   ```
   - Add it to your [blog page header code (settings icon for blog page -> advanced -> Page Footer Code Injection)](https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection?platform=v6&websiteId=648b5b11288f901493ae95af#toc-per-page-code-injection) or use a [code block](https://support.squarespace.com/hc/en-us/articles/206543167-Code-blocks) on the blog page. Note this is your blog posts page, not the individual collections page.

That's it! You're all set. 🎉




### Our Commitment to Creatives:

We at Excito LLC deeply admire the passion and artistry of photographers and creatives. This plugin is our little gift to the community. Instead of making it paid, we're sharing it for free, hoping it adds value to your digital canvas.



## 📜 License & Terms Details

The Excito LLC Table of Contents Plugin is licensed under the General Public License (GPL). It means you have the freedom to use, modify, and even redistribute it, keeping certain conditions in mind. This offers you:

- **Freedom to Use and Share:** Use the plugin for any purpose and share it with others.
- **Freedom to Change:** Feel free to modify the plugin to better fit your requirements or to fix any issues.
- **Freedom to Share Changes:** Share any improvements or derivative works with others. Any distributed derivative work must also be licensed under the GPL.


For the full license details, please check [here](https://excitollc.com/squarespace-plugins/squarespace-table-of-contents-plugin) or the [license file](../LICENSE) of the repository.

## Gratitude & Attribution: 
While not mandatory, we kindly ask that if you benefit from our plugin, consider linking back to [plugin on our website](https://excitollc.com/squarespace-plugins/squarespace-table-of-contents-plugin). It's a small gesture that helps us continue our journey.

## Stay Updated!

Want to receive updates for this plugin? [Subscribe with your email address](https://excitollc.com/squarespace-plugins/squarespace-table-of-contents-plugin).



## About Excito LLC

At **Excito LLC**, we're passionate about supporting creatives. To delve deeper into SEO insights and get the latest updates, don't forget to check out [our blog](https://excitollc.com/blog). For more details about us and our offerings, [visit our website](https://excitollc.com/).


## 🛠 For the Devs Out There:

### Technical Details:

- **Framework**: JavaScript (Vanilla)
- **Dependencies**: None

### Contributing:

We'd love your input! Please ensure you follow our contribution guidelines:
1. Fork the repo.
2. Make your changes in a new branch.
3. Submit a pull request and describe your modifications.


## 💌 Stay in Touch:

If you have any questions, feedback, or just wish to share your creative journey with us:
- 🌐 Check out our [website](YOUR_WEBSITE_LINK).
- 📬 Email us at [info@excito.com](mailto:info@excito.com).

Thank you for choosing Excito's plugin for Squarespace. Feel free to reach out for any queries, feedback, or just to say hello! 📸❤️ Keep shining and creating! 💡
