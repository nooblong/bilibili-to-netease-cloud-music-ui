import {
  DateField,
  DeleteButton,
  EditButton, ImageField,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import {type BaseRecord, useMany} from "@refinedev/core";
import {Space, Table} from "antd";

export const ListVoicelistList = () => {
  const {tableProps} = useTable({
    resource: "uploadDetail/listVoicelist",
    syncWithLocation: true,
  });

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany({
  //   resource: "categories",
  //   ids:
  //     tableProps?.dataSource
  //       ?.map((item) => item?.category?.id)
  //       .filter(Boolean) ?? [],
  //   queryOptions: {
  //     enabled: !!tableProps?.dataSource,
  //   },
  // });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="封面"
          dataIndex="voicelistImage"
          render={(url: string) => <ImageField value={url} width={100}/>}
        />
        <Table.Column title="名称" dataIndex="voicelistName"/>
        <Table.Column title="上传数" dataIndex="uploadCount"/>
        <Table.Column title="订阅数" dataIndex="subscribeNum"/>
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton size="large" recordItemId={record.id}>进入</ShowButton>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
