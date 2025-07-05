

const ListTableStudentSchool = ({
    ListName,
    ListRole,
    ListClass,
    ListAction,
    showDataList,
    ListSubClass,
    ListEmail,
    hide,
}) => {
    return (
        <>
            <div>
                <div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 ">
                        <div className="inline-block min-w-full shadow rounded-lg ">
                            <table className="min-w-full leading-normal table-auto table-styling">
                                <thead>
                                    <tr>
                                        <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListName}
                                        </th>
                                       
                                        <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListClass}
                                        </th>
                                            <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListSubClass}
                                        </th>
                                            
                                         <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListRole}
                                        </th>
                                              <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListEmail}
                                        </th>
                                        <th className="w-fit px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
                                            {ListAction}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{showDataList}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListTableStudentSchool;
