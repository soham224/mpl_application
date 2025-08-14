import React from "react";
import { useJsonToCsv } from "react-json-csv";
import * as PropTypes from "prop-types";

const { saveAsCsv } = useJsonToCsv();

export function CSVDownloader(props) {
  let { data = [], fields = {}, filename = "", className , buttonName } = props;
  return (
    <div className={className}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => saveAsCsv({ data, fields, filename })}
      >
        {buttonName}
      </button>
    </div>
  );
}

CSVDownloader.propTypes = {
  data: PropTypes.array,
  fields: PropTypes.object,
  filename: PropTypes.string,
  className: PropTypes.string,
};
