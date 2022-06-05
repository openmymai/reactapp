import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { gql } from "apollo-boost";
import Image from "next/image";
import AppContext from "../context/AppContext";
import { Container } from "react-bootstrap";

const GET_ASSESSMENT = gql`
  query($id: ID!) {
    assessment(id: $id) {
      id
      item
      label
      title
      description
      remark
      image {
        url
      }
    }
  }
`

function Assessments() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ASSESSMENT, {
    variables: { id: router.query.id },
  });
  const appContext = useContext(AppContext);
  const { isAuthenticated } = appContext;

  if (error) return "Error Loading Assessments";
  if (loading) return <h1>Loading ...</h1>;
  if (data.assessment) {
    const { assessment } = data;
    return (
      <>
        <div>
        {isAuthenticated ? (
        <div className="image-asset">
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${assessment.image.url}`} alt={assessment.item} className="center" />
          <h2>{assessment.title}</h2>
          <h3>หมายเลขกำกับ {" "} {assessment.label}</h3>
          <h6>รหัสทรัพย์สิน {" "} {assessment.item}</h6>
          <h3>รายละเอียด</h3>
          <h5>{assessment.description}</h5>
          <h3>หมายเหตุ</h3>
          <h5>{assessment.remark}</h5>
        </div>
        ) : (
          <>
          <Container>
            <h3 style={{textAlign: 'center'}}>ระบบทะเบียน เก็บรวบรวมสมบัติพระพุทธเจ้า ๒๘ พระองค์</h3>
            <Image
              src="/registration.png"
              alt="Registration"
              width={3334}
              height={1700}
            />
          </Container>
        </>
        )}
        </div>
      </>

    )
  }
}

export default Assessments;
