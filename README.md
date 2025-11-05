# 🏥 X-ray Machine Evaluation Form

A comprehensive web-based evaluation system for comparing and rating X-ray machines based on technical specifications and performance criteria.

## 🌐 Live Demo

**Deployed on Firebase Hosting:**
- **Live URL:** [https://xray-evaluation.web.app](https://xray-evaluation.web.app)
- **Project:** clinicregistrationform
- **Status:** ✅ Active

## 📋 Overview

This project provides an interactive form for conducting desk reviews of X-ray machines, allowing healthcare professionals to systematically evaluate and compare different X-ray equipment based on standardized criteria.

### Key Features

- ✅ **Dynamic CSV-driven Questions** - Questions loaded from external CSV file for easy updates
- ✅ **Multi-Machine Comparison** - Rate three machines side-by-side (BullsEye, Aimed, GE)
- ✅ **Google Sheets Integration** - Automatic submission of responses to Google Sheets
- ✅ **Progress Tracking** - Visual progress indicator showing completion percentage
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Modern UI/UX** - Beautiful gradient design with smooth animations
- ✅ **Real-time Validation** - Ensures all required fields are completed
- ✅ **Automatic Calculations** - Scores calculated and stored in Google Sheets

## 🚀 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **CSV Parsing:** PapaParse library (v5.4.1)
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Hosting:** Firebase Hosting
- **Version Control:** Git & GitHub

## 📁 Project Structure

```
XRAY_HTML_Form/
├── index.html                              # Main form interface
├── Xray_Evaluation_Questions_Simple.csv    # Question data source
├── Code.gs                                 # Google Apps Script backend
├── firebase.json                           # Firebase hosting configuration
├── .firebaserc                             # Firebase project settings
├── .firebaseignore                         # Files to exclude from deployment
├── .gitignore                              # Git ignore rules
├── README.md                               # This file
│
├── Documentation/
│   ├── DEPLOYMENT_SUCCESS_GUIDE.html       # Visual deployment walkthrough
│   ├── FIREBASE_MULTIPLE_SITES_ONE_PROJECT.txt
│   ├── FIREBASE_QUICKSTART_FREE_PLAN.txt
│   ├── FIREBASE_HOST_IN_EXISTING_PROJECT.txt
│   ├── CRITICAL_BUG_FOUND_AND_FIXED.txt
│   ├── COMPLETE_SETUP_AND_TESTING_GUIDE.txt
│   └── [other documentation files]
│
└── Alternative Forms/
    ├── form.html                           # Original version
    ├── enhance_form.html                   # Enhanced version
    ├── csv_validator.html                  # CSV testing tool
    └── index_offline.html                  # Offline version
```

## 🎯 Evaluated Machines

1. **BullsEye** - SG Jumong + DRTECH
2. **Aimed** - Carestream Horizon + Trimax
3. **GE** - Definium Pace Select + FlashPad

## 📊 Evaluation Categories

The form evaluates machines across multiple categories:
- Image Quality
- Radiation Dose & Safety
- Technical Specifications
- Workflow & Usability
- Reliability & Maintenance
- Digital Features
- And more...

## 🔧 Setup Instructions

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Firebase CLI (for deployment)
- Node.js and npm (for Firebase CLI)
- Google Account (for Google Sheets integration)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/JamesGuillermo/Xray_Evaluation_HTML_Form.git
   cd Xray_Evaluation_HTML_Form
   ```

2. **Open locally**
   - Simply open `index.html` in a web browser
   - Or use a local server:
     ```bash
     npx http-server -p 8080
     ```
   - Access at: `http://localhost:8080`

3. **Test the form**
   - Fill out test data
   - Check browser console for data structure
   - Verify CSV questions load correctly

### Google Sheets Integration Setup

1. **Create Google Sheet**
   - Create a new Google Sheet
   - Note the Sheet ID from the URL

2. **Deploy Apps Script**
   - Open Google Apps Script: [script.google.com](https://script.google.com)
   - Create new project
   - Copy contents of `Code.gs` into the script editor
   - Update `SHEET_ID` variable with your Sheet ID
   - Deploy as Web App:
     - Click "Deploy" → "New deployment"
     - Type: Web app
     - Execute as: Me
     - Who has access: Anyone
     - Deploy

3. **Update Form Configuration**
   - Open `index.html`
   - Find `GOOGLE_SCRIPT_URL` (line ~615)
   - Replace with your deployed Apps Script URL
   - Save the file

### Firebase Deployment

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not already done)**
   ```bash
   firebase init
   ```
   - Select: Hosting
   - Use existing project or create new
   - Public directory: `.` (current folder)
   - Single-page app: No
   - Overwrite index.html: No

4. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting:xray-evaluation
   ```

5. **Access your live site**
   - URL will be displayed after deployment
   - Example: `https://xray-evaluation.web.app`

## 📝 Updating Questions

To modify or add questions:

1. Edit `Xray_Evaluation_Questions_Simple.csv`
2. Columns required:
   - What it's about (Category)
   - What to check (Criteria)
   - Your rating question (0–5)
   - BullsEye machine specifications
   - Aimed machine specifications
   - GE machine specifications
3. Save the CSV file
4. Redeploy: `firebase deploy --only hosting:xray-evaluation`

## 🔄 How to Update the Form

After making any changes to the code:

1. **Test locally first**
   ```bash
   npx http-server -p 8080
   ```

2. **Commit changes to Git**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting:xray-evaluation
   ```

4. **Verify changes**
   - Open live URL
   - Hard refresh: `Ctrl + Shift + R`
   - Test form submission

## 🐛 Troubleshooting

### CSV Not Loading
- Check that `Xray_Evaluation_Questions_Simple.csv` is in the same folder
- Verify CSV filename matches exactly in `index.html`
- Check browser console for errors

### Form Not Submitting to Google Sheets
- Verify `GOOGLE_SCRIPT_URL` is correct in `index.html`
- Check that Apps Script is deployed as Web App
- Ensure Apps Script has permissions (Execute as: Me)
- Check Google Sheet permissions

### Changes Not Showing After Deployment
- Clear browser cache (`Ctrl + Shift + R`)
- Try incognito/private window
- Wait 5 minutes for CDN to update
- Check Firebase Console → Hosting → Files

### Executable Files Error on Firebase
- Ensure `.firebaseignore` excludes `.exe`, `.bat`, `npx` files
- Check `firebase.json` ignore patterns
- Remove executable files from deployment

## 📖 Documentation

Detailed documentation available in the project:

- **DEPLOYMENT_SUCCESS_GUIDE.html** - Visual step-by-step deployment guide
- **FIREBASE_MULTIPLE_SITES_ONE_PROJECT.txt** - Multi-site hosting setup
- **CRITICAL_BUG_FOUND_AND_FIXED.txt** - Google Sheets integration fixes
- **COMPLETE_SETUP_AND_TESTING_GUIDE.txt** - Full setup instructions

## 🔒 Security & Privacy

- Form submissions sent via HTTPS
- Google Sheets access controlled by Apps Script permissions
- No personal data stored on client-side
- All data stored in Google Sheets (controlled by organization)

## 🌟 Features in Development

- [ ] Custom domain support
- [ ] Firebase Authentication for restricted access
- [ ] Cloud Functions for email notifications
- [ ] PDF export of evaluations
- [ ] Admin dashboard for viewing responses
- [ ] Offline mode with local storage
- [ ] Multi-language support

## 📊 Usage Statistics

- **Deployment Date:** November 5, 2025
- **Questions:** 28 evaluation criteria
- **Machines:** 3 X-ray systems
- **Total Ratings:** 84 data points per submission
- **Firebase Plan:** Spark (Free)
- **Monthly Bandwidth:** 360 MB/day (sufficient for ~3,600 loads/day)

## 🤝 Contributing

This is an internal project for healthcare facility use. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Internal use only - Healthcare facility project

## 👥 Author

**IT Admin**
- Organization: Lifecare
- Date: November 2025

## 📞 Support

For issues or questions:
- Check documentation files in the project folder
- Review `DEPLOYMENT_SUCCESS_GUIDE.html` for visual guides
- Contact IT department for assistance

## 🎉 Acknowledgments

- Firebase for hosting infrastructure
- Google Sheets for data storage
- PapaParse for CSV parsing
- GitHub for version control

## 📈 Changelog

### Version 1.0.0 (November 5, 2025)
- ✨ Initial release
- ✅ CSV-driven dynamic form generation
- ✅ Google Sheets integration
- ✅ Firebase hosting deployment
- ✅ Responsive design
- ✅ Progress tracking
- ✅ Multi-site Firebase setup

---

**Live Form:** [https://xray-evaluation.web.app](https://xray-evaluation.web.app)

**Last Updated:** November 5, 2025
