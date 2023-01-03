import ContentInner from "../layout/ContentInner";
import { SearchArea } from "../layout/SearchArea";
import { SearchRow } from "../layout/SearchRow";
import { ResultArea } from "../layout/ResultArea";
import { ButtonArea, LeftButtonArea, RightButtonArea } from "../layout/ButtonArea";
import { StatusArea } from "../layout/StatusArea"
import { CommonButton, SearchButton, RefreshButton, SaveButton } from "../component/CommonButton";
import { GridAddRowButton, GridDeleteRowButton, GridSaveButton, GridExcelExportButton, GridExcelImportButton } from "../component/grid/GridButton";
import { LargeExcelDownload, LargeExcelUpload } from '../component/LargeExcelButton';
import InputField from "../component/InputField";
// import { LabelInputField } from "./component/LabelInputField";
import BaseGrid from '../component/grid/BaseGrid';
import TreeGrid from '../component/grid/TreeGrid';
import Pagination from '../component/Pagination';
import PopupDialog from '../component/PopupDialog';
import { GridCnt } from '../component/grid/GridCnt';
import { useViewStore } from "../store/viewStore";
import { useUserStore } from "../store/userStore";
import { zAxios } from "../service/serviceCall";
import { getAppSettings } from "../utils/common";
import { FormArea } from "../component/FormArea";
import { FormItem } from "../component/FormItem";
import { FormRow } from "../component/FormRow";
import { GroupBox } from "../component/GroupBox";
import { VLayoutBox } from "../component/VLayoutBox";
import { HLayoutBox } from "../component/HLayoutBox";
import { FileUploader } from "../component/FileUploader";

let projectCode = getAppSettings('projectCode');
const useStyles = require('../component/' + projectCode + 'CommonStyle').useStyles;
const useIconStyles = require('../component/' + projectCode + 'CommonStyle').useIconStyles;

export {
  ContentInner, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, TreeGrid, CommonButton, SearchButton, RefreshButton, SaveButton, StatusArea, VLayoutBox, HLayoutBox, FileUploader,
  GridExcelImportButton, GridExcelExportButton, LargeExcelDownload, LargeExcelUpload,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, GridCnt, Pagination, PopupDialog,
  useStyles, useIconStyles, useViewStore, useUserStore, FormArea, FormRow, FormItem, GroupBox,
  zAxios
}
