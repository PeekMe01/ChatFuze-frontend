import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
//import { config } from "@gluestack-ui/config" // Optional if you want to use default theme

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Text>Hello World!</Text>
    </GluestackUIProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
