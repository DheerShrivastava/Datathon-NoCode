import pdfplumber
import pandas as pd
from tkinter import Tk, filedialog

# Function to select a PDF file
def select_pdf_file():
    Tk().withdraw()  # Hide the root Tkinter window
    file_path = filedialog.askopenfilename(
        filetypes=[("PDF files", "*.pdf")], title="Select a PDF file"
    )
    return file_path

# Function to parse and save data to CSV
def parse_pdf_to_csv(pdf_path, csv_output_path):
    data = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            print(f"Processing page {i + 1}...")
            text = page.extract_text()
            if text:
                lines = text.split("\n")
                for line in lines:
                    # Example custom splitting by spaces
                    parsed_line = line.split()  # Splits line into a list of words
                    data.append(parsed_line)

    # Convert data to a DataFrame and save to CSV
    if data:
        df = pd.DataFrame(data)
        df.to_csv(csv_output_path, index=False, header=False)
        print(f"CSV file saved at: {csv_output_path}")
    else:
        print("No data found in the PDF.")

# Main logic
if __name__  == "__main__":
    print("Select the PDF file to parse and save to CSV.")
    pdf_file = select_pdf_file()
    if pdf_file:
        output_csv = pdf_file.replace(".pdf", "_parsed.csv")
        parse_pdf_to_csv(pdf_file, output_csv)
    else:
        print("No file selected.")
