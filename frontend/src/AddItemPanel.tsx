import React, { useState } from 'react';

export interface AddItemPanelProps {
	add: (id: ID, data: BookData) => Promise<boolean>,
}

const AddItemPanel: React.FC<AddItemPanelProps> = (props) => {
	const [id, setId] = useState<ID>("");
	const [data, setData] = useState<BookData>({ title: "" });

	return (
		<>
			<form onSubmit={async (e) => {
				e.preventDefault()
				const successful = await props.add(id, data)

				if (successful) {
					alert("updated successfully")
				} else {
					alert("already exists")
				}
			}}>
				<label>ID</label>
				<input
					type='text' value={id}
					onChange={(e) => {
						setId(e.target.value)
					}}
				/>

				<label>title</label>
				<input
					type='text' value={data?.title}
					onChange={(e) => {
						setData({ title: e.target.value })
					}}
				/>
				<input type='submit' />
			</form>
		</>
	)
}

export default AddItemPanel;
