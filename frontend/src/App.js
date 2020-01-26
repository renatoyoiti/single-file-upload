import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import api from './services/api';

import GlobalStyle from './styles/global';
import { Container, Content } from './styles';

import Upload from './components/Upload';
import FileList from './components/FileList';

function App() {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const handleUpload = files => {
		const newFiles = files.map(file => ({
			file,
			id: uniqueId(),
			name: file.name,
			readableSize: filesize(file.size),
			preview: URL.createObjectURL(file),
			progress: 0,
			uploaded: false,
			error: false,
			url: null
		}));

		setUploadedFiles(uploadedFiles.concat(newFiles));
	};

	useEffect(() => {
    const fileProgress = uploadedFiles;

    const uploadData = (id, data ) => {
      const files = uploadedFiles;
      const fileWithProgress = files.map(file => {
        return id === file.id ? { ...file, ...data} : file;
      });
      console.log(fileWithProgress);
      setUploadedFiles(fileWithProgress);
    };

		const uploadFile = (fileProgress) => {
			fileProgress.map(uploadedFile => {
				const data = new FormData();
				data.append('file', uploadedFile.file, uploadedFile.name);

				api.post('/posts', data, {
					onUploadProgress: e => {
						const progress = parseInt(Math.round((e.loaded * 100) / e.total));

						uploadData(uploadedFile.id, { progress, });
					}
				});
			});
    };

    console.log(fileProgress);

    uploadFile(fileProgress);
	}, [uploadedFiles]);

	return (
		<Container>
			<Content>
				<Upload onUpload={handleUpload} />
				{!!uploadedFiles.length && <FileList files={uploadedFiles} />}
			</Content>
			<GlobalStyle />
		</Container>
	);
}

export default App;
