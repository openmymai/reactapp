import { HttpLink } from "apollo-link-http";
import { withData } from "next-apollo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.20.0.61:1337"

const config = { 
  link: new HttpLink({
    uri: `${API_URL}/graphql`,
  })
};

export default withData(config);
