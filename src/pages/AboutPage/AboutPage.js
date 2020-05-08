import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { Col, Row } from "antd";

export default () => (
	<Layout title="About" page="about">
		<Row style={{ fontSize: 18 }}>
			<Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 12 }}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi at
					autem deserunt doloribus ex excepturi, exercitationem fugit harum nam
					necessitatibus nisi omnis pariatur quod rem suscipit ullam velit
					veritatis vero.
				</p>
			</Col>
		</Row>
	</Layout>
);
