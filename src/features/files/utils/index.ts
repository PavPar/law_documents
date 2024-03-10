import { Dree } from "dree";

type GroupsFileTestType = { group: string; filepaths: string[] };

/*

Для поиска все равно потребуется сделать таблицу => при старте надо пройти все дерево
При работе с созданием/удалением групп => надо будет обновлять таблицу

? Как хранить данные в json файле при учете что группы могут быть в группах?

v1 без учета группы в группах 

{
    group_1: files
    group_2: files
}

v2 с учетом группа в группе

{
    group_1: {
        name: group_1,
        files: files,
        parent_id: string
    },
    group_2: {
        name: group_1,
        files: files,
        parent_id: string
    },
    group_3: {
        name: group_1,
        files: files,
        parent_id: string
    }
}

v3 улучшенная 

{
    [uidv4] : {
        name: group_1,
        files: files,
        parent_id: string
    },
    [uidv4] : {
        name: group_1,
        files: files,
        parent_id: string
    },
    [uidv4] : {
        name: group_1,
        files: files,
        parent_id: string
    },
}
*/

type ProductItem = {
  name: string;
  type: "file" | "group";
  items?: ProductItem[]; // TODO: items только для групп ?
  parent_id: string; // TODO: parent => использовать гененрацию в виде uuidv4 с проверкой на наличие дубликтов (чтобы точно нельзя было иметь дублиаката item);
};

type Product = {
  name: string;
  items: ProductItem[];
};

/*

{
    name:test_1,
    items:{
        test_2:{
            name:test_2,

        }
    }
}

*/
