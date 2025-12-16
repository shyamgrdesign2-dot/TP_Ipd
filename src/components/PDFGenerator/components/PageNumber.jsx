import { StyleSheet } from "@react-pdf/renderer";
import { Text } from "./MultilingualText";

const styles = StyleSheet.create({
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    fontWeight: 400,
    bottom: 10,
    right: 10,
    textAlign: "center",
    color: "#454551",
  },
});

const PageNumber = () => (
  <Text
    fixed
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`}
  />
);

export default PageNumber;
