import { AppProvider, Page, EmptyState, Layout, TextStyle } from '@shopify/polaris';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => (
  <AppProvider>
    <Page>
      <Layout>
        <EmptyState
          heading="Admin page"
          image={img}
        >
        
        </EmptyState>
      </Layout>
    </Page>
  </AppProvider>
)

export default Index; 