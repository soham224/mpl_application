import React, { useState } from 'react';
import { downloadResultExcel } from '../app/ResultManager/modules/MyResults/_redux/MyResultApi';
import { successToast, warningToast } from '../utils/ToastMessage';

export function ExcelDownloadButton({ idList, buttonText = "Download Excel", className = "btn btn-primary" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!idList || idList.length === 0) {
      warningToast("No data selected for download");
      return;
    }

    setIsLoading(true);
    try {
      await downloadResultExcel(idList);
      successToast("Excel file downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      warningToast("Failed to download Excel file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleDownload}
      disabled={isLoading || !idList || idList.length === 0}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          Downloading...
        </>
      ) : (
        buttonText
      )}
    </button>
  );
} 