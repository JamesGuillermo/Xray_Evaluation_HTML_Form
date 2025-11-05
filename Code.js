// ========================================
// GOOGLE APPS SCRIPT - X-RAY EVALUATION FORM BACKEND
// ========================================
// This script receives form submissions from index.html
// and saves them to Google Sheets
//
// Setup Instructions: See DEPLOYMENT_INSTRUCTIONS.txt
// ========================================

// ========================================
// CONFIGURATION - CUSTOMIZE THESE VALUES
// ========================================

// Your Google Sheet ID (found in the URL)
// Example: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
const SHEET_ID = '1i16GiklESSHyP89rVRhlyNwqcteohc9F0Dk7osFnwSk';

// Sheet tab name where responses will be saved
const SHEET_NAME = 'Responses';

// Optional: Enable email notifications on submission
const SEND_EMAIL_NOTIFICATIONS = false;
const NOTIFICATION_EMAIL = 'IT@multilifecare.ph';

// ========================================
// doGet() - Handle GET requests (for testing)
// ========================================
/**
 * Handles GET requests to the web app
 * Used for testing if the script is deployed correctly
 * 
 * Test by visiting: YOUR_WEB_APP_URL
 */
function doGet(e) {
  // Return a simple HTML page confirming the script is working
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>X-ray Form Backend</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 40px; 
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .container {
          background: rgba(255,255,255,0.95);
          color: #333;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 600px;
        }
        h1 { color: #667eea; margin-top: 0; }
        .status { 
          font-size: 48px; 
          margin: 20px 0;
        }
        .info {
          background: #f0f4ff;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: left;
        }
        .info h3 {
          margin-top: 0;
          color: #667eea;
        }
        .timestamp {
          color: #666;
          font-size: 0.9em;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="status">✅</div>
        <h1>Apps Script is Active!</h1>
        <p style="font-size: 1.2em;">X-ray Evaluation Form Backend</p>
        
        <div class="info">
          <h3>Status Information:</h3>
          <p><strong>Script Status:</strong> Deployed and Running</p>
          <p><strong>Sheet ID:</strong> ${SHEET_ID}</p>
          <p><strong>Target Sheet:</strong> ${SHEET_NAME}</p>
          <p><strong>Email Notifications:</strong> ${SEND_EMAIL_NOTIFICATIONS ? 'Enabled' : 'Disabled'}</p>
        </div>
        
        <p>This endpoint is ready to receive POST requests from your HTML form.</p>
        <p>To test form submission, fill out index.html and click Submit.</p>
        
        <div class="timestamp">
          Server Time: ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

// ========================================
// doPost() - Handle POST requests (form submissions)
// ========================================
/**
 * Handles POST requests from the HTML form
 * Receives form data and saves it to Google Sheets
 * 
 * Expected data format:
 * {
 *   "reviewer_name": "Dr. Smith",
 *   "affiliation": "City Hospital",
 *   "review_date": "2025-11-05",
 *   "ratings": {
 *     "q1_bullseye": 4,
 *     "q1_aimed": 3,
 *     "q1_ge": 5,
 *     ... (84 total ratings for 28 questions × 3 machines)
 *   }
 * }
 */
function doPost(e) {
  try {
    // Log the incoming request (for debugging)
    Logger.log('Received POST request');
    Logger.log('Post data: ' + e.postData.contents);
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.reviewer_name || !data.reviewer_role || !data.review_date || !data.ratings) {
      throw new Error('Missing required fields');
    }
    
    // Open the Google Sheet
    const sheet = getOrCreateSheet();
    
    // Prepare the row data
    const rowData = prepareRowData(data);
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Log success
    Logger.log('Successfully added row to sheet');
    
    // Send email notification if enabled
    if (SEND_EMAIL_NOTIFICATIONS && NOTIFICATION_EMAIL) {
      sendNotificationEmail(data);
    }
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Evaluation saved successfully',
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log('Error in doPost: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get or create the responses sheet
 * Creates the sheet and headers if it doesn't exist
 */
function getOrCreateSheet() {
  // Open the spreadsheet
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Try to get the sheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create the sheet if it doesn't exist
  if (!sheet) {
    Logger.log('Sheet not found. Creating new sheet: ' + SHEET_NAME);
    sheet = ss.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = createHeaderRow();
    sheet.appendRow(headers);
    
    // Format the header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('#ffffff');
    
    // Freeze the header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    Logger.log('Sheet created with headers');
  }
  
  return sheet;
}

/**
 * Create the header row for the sheet
 * Based on the CSV structure: 28 questions × 3 machines = 84 rating columns
 */
function createHeaderRow() {
  const headers = [
    'Timestamp',
    'Reviewer Name',
    'Role/Position',
    'Review Date'
  ];
  
  // Add question headers (Q1 through Q28 for each machine)
  // 28 questions × 3 machines = 84 columns
  for (let q = 1; q <= 28; q++) {
    headers.push(`Q${q} BullsEye`);
    headers.push(`Q${q} Aimed`);
    headers.push(`Q${q} GE`);
  }
  
  // Add total columns for each machine
  headers.push('BullsEye Total');
  headers.push('Aimed Total');
  headers.push('GE Total');
  headers.push('Grand Total');
  
  return headers;
}

/**
 * Prepare row data from the form submission
 * Organizes ratings in the correct column order
 */
function prepareRowData(data) {
  const row = [
    new Date(), // Timestamp
    data.reviewer_name,
    data.reviewer_role,
    data.review_date
  ];
  
  // Add ratings in order: Q1-BullsEye, Q1-Aimed, Q1-GE, Q2-BullsEye, etc.
  for (let q = 1; q <= 28; q++) {
    // BullsEye rating for this question
    const bullseyeKey = `q${q}_bullseye`;
    row.push(Number(data.ratings[bullseyeKey]) || 0);
    
    // Aimed rating for this question
    const aimedKey = `q${q}_aimed`;
    row.push(Number(data.ratings[aimedKey]) || 0);
    
    // GE rating for this question
    const geKey = `q${q}_ge`;
    row.push(Number(data.ratings[geKey]) || 0);
  }
  
  // Add formulas for totals (these will be calculated in the sheet)
  // Column index for first rating: 5 (E column)
  // Last rating column: 5 + 83 = 88 (column CL)
  const rowNum = getOrCreateSheet().getLastRow() + 1;
  
  // BullsEye Total (sum of every 3rd column starting from E)
  row.push(`=SUMPRODUCT((MOD(COLUMN(E${rowNum}:CJ${rowNum})-COLUMN(E${rowNum}),3)=0)*(E${rowNum}:CJ${rowNum}))`);
  
  // Aimed Total (sum of every 3rd column starting from F)
  row.push(`=SUMPRODUCT((MOD(COLUMN(F${rowNum}:CK${rowNum})-COLUMN(F${rowNum}),3)=0)*(F${rowNum}:CK${rowNum}))`);
  
  // GE Total (sum of every 3rd column starting from G)
  row.push(`=SUMPRODUCT((MOD(COLUMN(G${rowNum}:CL${rowNum})-COLUMN(G${rowNum}),3)=0)*(G${rowNum}:CL${rowNum}))`);
  
  // Grand Total (sum of all three machine totals)
  row.push(`=CM${rowNum}+CN${rowNum}+CO${rowNum}`);
  
  return row;
}

/**
 * Send email notification on form submission (optional)
 */
function sendNotificationEmail(data) {
  try {
    const subject = '✅ New X-ray Machine Evaluation Submitted';
    
    const body = `
A new X-ray machine evaluation has been submitted.

Reviewer Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.reviewer_name}
Role/Position: ${data.reviewer_role}
Review Date: ${data.review_date}
Submission Time: ${new Date().toLocaleString()}

Total Ratings Submitted: ${Object.keys(data.ratings).length}

View the full response in your Google Sheet:
${SpreadsheetApp.openById(SHEET_ID).getUrl()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from the X-ray Evaluation Form.
    `;
    
    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    Logger.log('Notification email sent to: ' + NOTIFICATION_EMAIL);
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
    // Don't throw error - email failure shouldn't stop the submission
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Test function to verify sheet access
 * Run this from the Apps Script editor to test your configuration
 */
function testSheetAccess() {
  try {
    const sheet = getOrCreateSheet();
    Logger.log('✅ Successfully accessed sheet: ' + sheet.getName());
    Logger.log('Sheet has ' + sheet.getLastRow() + ' rows');
    return true;
  } catch (error) {
    Logger.log('❌ Error accessing sheet: ' + error.toString());
    return false;
  }
}

/**
 * Test function to simulate a form submission
 * Run this from the Apps Script editor to test the full workflow
 */
function testFormSubmission() {
  // Create sample data matching the expected format
  const testData = {
    reviewer_name: 'Test User',
    reviewer_role: 'Test Hospital',
    review_date: '2025-11-05',
    ratings: {}
  };
  
  // Generate sample ratings (all 3s for testing)
  for (let q = 1; q <= 28; q++) {
    testData.ratings[`q${q}_bullseye`] = 3;
    testData.ratings[`q${q}_aimed`] = 3;
    testData.ratings[`q${q}_ge`] = 3;
  }
  
  // Create a mock POST request
  const mockRequest = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  // Call doPost with the mock request
  const result = doPost(mockRequest);
  
  Logger.log('Test submission result: ' + result.getContent());
}

/**
 * Function to clear all responses (use with caution!)
 * Keeps the header row, deletes all data rows
 */
function clearAllResponses() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log('Cleared ' + (lastRow - 1) + ' response rows');
  } else {
    Logger.log('No responses to clear');
  }
}

/**
 * Function to export responses as JSON
 * Returns all responses in JSON format
 */
function exportResponsesAsJSON() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const responses = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    responses.push(row);
  }
  
  Logger.log(JSON.stringify(responses, null, 2));
  return responses;
}
