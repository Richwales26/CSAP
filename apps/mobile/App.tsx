import { Text, View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>CSAP — Protected</Text>
      <Text>Risk: Low — locks active, link connected.</Text>
      <Text style={{ marginTop: 8, color: "#666" }}>
        CSAP is not an emergency service.
      </Text>
    </View>
  );
}
