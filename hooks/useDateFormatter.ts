// ~/hooks/useDateFormatter.js
export default function useDateFormatter(date: Date) {

  // Format date as per your requirements
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options)
}
