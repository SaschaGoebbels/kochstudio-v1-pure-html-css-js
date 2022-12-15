'use strickt';
// reloade div after change recipe or fav
// reopen after new name
// Animation swipe list le ri

// fav obj show list
// example list deactivate
// edit recipe
// search recipe

// // weeklyplan
// // shoppinglist
// // search function

const local_list_name = 'Kochstudio_Rezepte';
const emty_list_str = 'Die Liste ist leer !';
let list_click;
let actual_recipe_i;
let recipe_page_active = false;
let recipe_edit_page_active = false;
let btn_add_to_list = document.querySelector('#btn_add_to_list');
let btn_read_json_file = document.querySelector('#read_json_file');
let btn_delete_json_file = document.querySelector('#delete_json_file');
const url = window.location.href;
let fav = false; // Status of RecipeItem
let recipe = {};
let recipe_fav = [];
let recipe_fav2 = [];
const recipe_obj_example = {
  name: ' ',
  fav: false,
  ingredients: [],
  preparation: ' ',
};
let new_recipe_obj = {};
let emty_list_obj = recipe_obj_example; // Die Liste ist leer !
// // //Scroll to top after reload
$(document).ready(function () {
  $(this).scrollTop(0);
});
//////////////////////////////////////////////////////////////////////////////////
// // // fetch api src json file // Examplelist
//////////////////////////////////////////////////////////////////////////////////

async function fetch_recipe_list() {
  let data = await fetch('/json/recipe_list.json')
    .then(response => response.json())
    .then(data => {
      recipe = data;
      f_fill_div(recipe.recipe_list, 'menulist');
      recipe_fav = recipe_create_fav(recipe.recipe_list);
      load_list_query(recipe.recipe_list, recipe.recipe_list);
    });
}

const recipe_create_fav = function (arr) {
  if (arr[0].name == emty_list_str) {
    return;
  }
  recipe_fav = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].fav == true) {
      recipe_fav.push(arr[i]);
    }
  }
  recipe_fav2 = recipe_fav;
};

//////////////////////////////////////////////////////////////////////////////////
// // // Buttons Queryselector
//////////////////////////////////////////////////////////////////////////////////
// // // Menu Buttons
const btn_menu = document.querySelector('#btn_menu');
const btn_menu_close = document.querySelector('#btn_menu_close');
// Menu List
const shopping_list = document.querySelector('#shopping_list');
const weekly_plan = document.querySelector('#weekly_plan');
const btn_save_to_downloads = document.querySelector('#btn_save_to_downloads');
const btn_load_list_from_txt_file = document.querySelector(
  '#btn_load_list_from_txt_file'
);
const load_example_list = document.querySelector('#load_example_list');
// // // Content Buttons
const btn_coincidence = document.querySelector('#coincidence_btn');
const btn_add_or_edit = document.querySelector('#btn_add_or_edit');
const navbar__fav_on_off = document.querySelector('#navbar__fav_on_off');
// // // Navbar
const btn_recipe = document.querySelector('#btn_recipe');
const btn_weekly_plan = document.querySelector('#btn_weekly_plan');
const btn_fav = document.querySelector('#btn_fav');
const btn_shoopinglist = document.querySelector('#btn_shoppinglist');
const content_page = document.querySelector('#content_page');
// // // Save Recipe Button
const btn_new_recipe_save = document.querySelector('#btn_new_recipe_save');
const btn_recipe_trash = document.querySelector('#btn_recipe_trash');
const btn_add_edit_close = document.querySelector('#btn_add_edit_close');
// // // Input Fields
const input_form = document.querySelector('#content__add_item');
const recipe_name = document.querySelector('#recipe_name');
const ingredient = document.querySelector('#ingredient');
const ingredient_quatity = document.querySelector('#ingredient_quatity');
const ingredient_unit = document.querySelector('#ingredient_unit');
const btn_add_ingredient = document.querySelector('#btn_add_ingredient');
const preperation = document.querySelector('#preperation');
// // // ingredients_show_box for input page
const ingredients_show_box = document.querySelector('#ingredients_show_box');
// // // ingredient for recipe page
const content_ingredients_box = document.querySelector(
  '#content_ingredients_box'
);
//////////////////////////////////////////////////////////////////////////////////
// // // div boxes
const div_menulist = document.querySelector('#div_menulist');
const div_menulist_fav = document.querySelector('#div_menulist_fav');

//////////////////////////////////////////////////////////////////////////////////
// // // Function Menu Button
//////////////////////////////////////////////////////////////////////////////////
// // // Menu Button Header Open
btn_menu.addEventListener('click', f_menu_toogle);
function f_menu_toogle() {
  document.querySelector('#menu_box').classList.toggle('menu_box_closed');
  if (recipe_page_active == true) {
    document.querySelector('#btn_fav_etc').classList.toggle('hide');
  }
}
// // // Menu Button Header Close
btn_menu_close.addEventListener('click', f_menu_toogle);
// // // Menu Button List
load_example_list.addEventListener('click', function () {
  if (
    confirm(
      'Alle Daten gehen verloren ! Wenn die Liste nicht vorher exportiert wird !'
    )
  ) {
    if (confirm('SICHER ???')) {
      fetch_recipe_list();
      f_menu_toogle();
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////
btn_save_to_downloads.addEventListener('click', function () {
  const export_name = local_list_name;
  export_to_downloads(recipe, export_name);
  f_menu_toogle();
});
//////////////////////////////////////////////////////////////////////////////////
// // // Functions Add & Coincidence Buttons
//////////////////////////////////////////////////////////////////////////////////
// // // Add New Recipe to List or Edit actual Recipe
btn_add_or_edit.addEventListener('click', f_btn_add_or_edit);
function f_btn_add_or_edit() {
  btn_active(btn_add_or_edit);
  input_form.classList.add('content__scroll_list_add_or_edit_show');
  hide_id('content__recipe_page');
  hide_content_box('hide');
  hide_id('coincidence_btn');
  hide_id('btn_add_or_edit');
  hide_id('navbar');
  hide_id('btn_fav_etc');
  unhide_id('save_btn_new_recipe_box');
  ingredients_show_box.innerHTML = ' ';
  let i; //= f_check_index_recipe_or_fav();
  new_recipe_obj = JSON.parse(JSON.stringify(recipe_obj_example));

  // // // check if index is from recipe or fav => than open
  if (recipe_page_active == true) {
    i = f_check_index_recipe_or_fav();
    h1_name(recipe.recipe_list[i].name);
    new_recipe_obj = JSON.parse(JSON.stringify(recipe.recipe_list[i]));
    // // // fill with Content if editmode (ingredients + preperation)
    input_fill_with_content(new_recipe_obj);
    input_edit_icon_opacity();
  } else {
    f_content_page(1);
    recipe_name.value = '';
    preperation.value = '';
    h1_name('Neuer Eintrag');
  }
  i = actual_recipe_i;
  swap_icon(recipe.recipe_list[i]);
  input_trash_icon(new_recipe_obj);
}
function f_check_index_recipe_or_fav() {
  if (content_page.classList.contains('content_page_3')) {
    // if (content__recipe_page.classList.contains('hide')) {
    f_search_index_by_name(
      recipe_fav2[actual_recipe_i].name,
      recipe.recipe_list
    );
    return actual_recipe_i;
  } else {
    return actual_recipe_i;
  }
  // }
  // // // skip "index search" if no listitem is selected
  // if (
  //   document.querySelector('#content__recipe_page').classList.contains('hide')
  // ) {
  //   return;
  // }
}
// // // search fav index in main recipe_list
function f_search_index_by_name(search_name, arr_input) {
  for (let i = 0; i < arr_input.length; i++) {
    if (search_name == arr_input[i].name) {
      return (actual_recipe_i = i);
    }
  }
}
// // // close edit menu
function f_add_or_edit_close() {
  input_form.classList.remove('content__scroll_list_add_or_edit_show');
  unhide_id('coincidence_btn');
  unhide_id('btn_add_or_edit');
  unhide_id('navbar');
  hide_id('save_btn_new_recipe_box');
  if (header__h1.innerHTML == 'Neuer Eintrag') {
    content__add_item.classList.remove('content__scroll_list_add_or_edit_show');
    setTimeout(() => {
      f_content_page(1);
      hide_content_box('unhide');
      h1_name('Gerichte');
    }, 200);
  } else {
    open_list_item(recipe.recipe_list, actual_recipe_i);
    //TODO reload list div
  }
}

// // // Coincidence
btn_coincidence.addEventListener('click', f_btn_coincidence);
function f_btn_coincidence() {
  btn_active(btn_coincidence);
  let arr;
  if (fav == true) {
    arr = recipe_fav2;
  } else {
    arr = recipe.recipe_list;
  }
  hide_content_box('hide');
  recipe_page_active = true;
  unhide_id('content__recipe_page');
  let random_number = actual_recipe_i;
  while (random_number == actual_recipe_i) {
    random_number = Math.trunc(Math.random() * arr.length);
  }
  f_recipe_page_fill_content(arr, random_number);
  unhide_id('btn_fav_etc');
}
//////////////////////////////////////////////////////////////////////////////////
// // // Function Save & Trash Button = Add New or Edit Recipe
//////////////////////////////////////////////////////////////////////////////////
btn_new_recipe_save.addEventListener('click', function () {
  btn_active(btn_new_recipe_save);
  new_recipe_obj.name = recipe_name.value;
  new_recipe_obj.preparation = preperation.value;
  const search_name = recipe_name.value;
  if (recipe_page_active) {
    recipe.recipe_list[actual_recipe_i] = new_recipe_obj;
    setTimeout(() => {
      unhide_id('content__recipe_page');
    }, 200);
  } else {
    // add new recipe object to recipe
    if (emty_list_str == recipe.recipe_list[0].name) {
      recipe.recipe_list.shift();
      recipe.recipe_list.push(new_recipe_obj);
    } else {
      recipe.recipe_list.push(new_recipe_obj);
    }
  }
  // // // save to locallist
  update_or_create_list_at_localstorage(local_list_name, recipe);
  // // // Clear all InputValues after save
  recipe_name.value = ' ';
  ingredient.value = '';
  ingredient_quatity.value = '';
  preperation.value = '';
  ingredients_show_box.innerHTML = ' ';
  // // // clear new_recipe_obj
  new_recipe_obj = JSON.parse(JSON.stringify(recipe_obj_example));
  f_add_or_edit_close();
  if (recipe_page_active == true) {
    // const search_name = recipe.recipe_list[actual_recipe_i].name;
    f_search_index_by_name(search_name, recipe.recipe_list);
    open_list_item(recipe.recipe_list, actual_recipe_i);
  }
});

btn_add_ingredient.addEventListener('click', function () {
  btn_active(btn_add_ingredient);
  ingredient_add_elements(
    ingredient.value,
    ingredient_quatity.value,
    ingredient_unit.value
  );
});
// // // Push Ingredients to new Object
function ingredient_add_elements(
  add_ingredient = ' ',
  add_quantity = ' ',
  add_unit = '--'
) {
  let arr = [add_ingredient, add_quantity, add_unit];
  ingredient.value = '';
  ingredient_quatity.value = '';
  new_recipe_obj.ingredients.push(arr);
  ingredients_show_box.classList.remove('hide');
  ingredients_show_box.innerHTML = ' ';
  for (let i = 0; i < new_recipe_obj.ingredients.length; i++) {
    ingredient_fill_p(new_recipe_obj.ingredients[i], ingredients_show_box, i);
  }
  input_edit_icon_opacity();
  input_trash_icon(new_recipe_obj);
}

btn_add_edit_close.addEventListener('click', function () {
  if (confirm(`Bearbeitung abbrechen ?`)) {
    btn_active(btn_add_edit_close);
    new_recipe_obj = JSON.parse(JSON.stringify(recipe_obj_example));
    f_add_or_edit_close();
    if (content_page.classList.contains('content_page_1')) {
      navbar_current_icon_switch_to(btn_recipe);
    }
  }
});

btn_recipe_trash.addEventListener('click', function () {
  btn_active(btn_recipe_trash);
  let message_name = 'Diesen Eintrag';
  if (recipe_page_active == true) {
    // if recipepage message name is recipe name
    message_name = recipe.recipe_list[f_check_index_recipe_or_fav()].name;
  }
  if (confirm(`${message_name} löschen ?`)) {
    recipe_page_active
      ? delete_list_item(f_check_index_recipe_or_fav())
      : console.log('');
    f_add_or_edit_close();
  } else {
    console.log('edit again');
  }
});
//////////////////////////////////////////////////////////////////////////////////
// // // Function Navbar Buttons
//////////////////////////////////////////////////////////////////////////////////
// // // Home - Recipelist
btn_recipe.addEventListener('click', f_btn_recipe);
function f_btn_recipe() {
  h1_name('Gerichte');
  f_content_page(1);
  hide_content_box('unhide');
  btn_navbar_icon_active(btn_recipe);
  fav = false;
  f_fill_div(recipe.recipe_list, '#div_ar_menulist', 'menulist');
  unhide_id('div_menulist');
  hide_id('content__recipe_page');
  recipe_page_active = false;
  hide_id('btn_fav_etc');
  navbar_current_icon_switch_to(btn_recipe);
}
// // // WeeklyPlan
btn_weekly_plan.addEventListener('click', f_btn_weekly_plan);
function f_btn_weekly_plan() {
  f_content_page(2);
  hide_content_box('unhide');
  hide_id('content__recipe_page');
  btn_navbar_icon_active(btn_weekly_plan);
  h1_name('Wochenplan');
  navbar_current_icon_switch_to(btn_weekly_plan);
}
// // // Favorit
btn_fav.addEventListener('click', f_btn_fav);
function f_btn_fav() {
  fav = true;
  f_content_page(3);
  hide_content_box('unhide');
  btn_navbar_icon_active(btn_fav);
  h1_name('Favoriten');
  f_fill_div(recipe_fav2, '#div_ar_menulist_fav', 'menulist_fav');
  recipe_page_active = false;
  hide_id('btn_fav_etc');
  hide_id('content__recipe_page');
  navbar_current_icon_switch_to(btn_fav);
}

// // // ShoppingList
btn_shoopinglist.addEventListener('click', f_btn_shoopinglist);
function f_btn_shoopinglist() {
  f_content_page(4);
  hide_content_box('unhide');
  hide_id('content__recipe_page');
  btn_navbar_icon_active(btn_shoopinglist);
  h1_name('Einkaufsliste');
  navbar_current_icon_switch_to(btn_shoppinglist);
  console.log(new_recipe_obj);
}
//////////////////////////////////////////////////////////////////////////////////
// // // Slide functions
function f_content_page(page) {
  content_page.classList.remove('content_page_1');
  content_page.classList.remove('content_page_2');
  content_page.classList.remove('content_page_3');
  content_page.classList.remove('content_page_4');

  if (page == 1) {
    content_page.classList.add('content_page_1');
  }
  if (page == 2) {
    content_page.classList.add('content_page_2');
  }
  if (page == 3) {
    content_page.classList.add('content_page_3');
  }
  if (page == 4) {
    content_page.classList.add('content_page_4');
  }
}
//////////////////////////////////////////////////////////////////////////////////
// // // Navbar animate Key press
function btn_navbar_icon_active(active_btn) {
  active_btn.classList.add('btn_navbar_icon_active');
  let timer = 150;
  setTimeout(btn => {
    active_btn.classList.remove('btn_navbar_icon_active');
  }, timer);
}
//////////////////////////////////////////////////////////////////////////////////
// // // Other btn animate Key press
function btn_active(active_btn) {
  active_btn.classList.add('btn_active');
  let timer = 300;
  setTimeout(btn => {
    active_btn.classList.remove('btn_active');
  }, timer);
}
//////////////////////////////////////////////////////////////////////////////////
// // // close menu if click in main div
document.querySelector('#main_div').addEventListener('click', () => {
  if (touchendX < 185) {
    document.querySelector('#menu_box').classList.add('menu_box_closed');
  }
  //debugging main div btn check
});

//////////////////////////////////////////////////////////////////////////////////
// // // Functions
//////////////////////////////////////////////////////////////////////////////////
// // // Change H1 Text
const h1_name = h1_name =>
  (document.querySelector('#header__h1').innerHTML = h1_name);
// // // Hide or Unhide Elements
const unhide_id = id => {
  document.querySelector('#' + id).classList.remove('hide');
};
const hide_id = id => {
  document.querySelector('#' + id).classList.add('hide');
};
function navbar_current_icon_switch_to(next_page) {
  document.querySelectorAll('.navbar__icon ').forEach(element => {
    element.classList.remove('current_icon');
  });
  next_page.classList.add('current_icon');
}
//////////////////////////////////////////////////////////////////////////////////
// // // Get ID of RecipeListitem
function load_list_query(arr, recipe_mainlist) {
  list_click = document
    .querySelectorAll('.content__ar_menulist li')
    .forEach(el =>
      el.addEventListener('click', function () {
        // // // if Fav List
        if (el.id.length > 12) {
          el_id = el.id.substring(12);
          open_list_item(arr, el_id);
        } else if (el.id.length < 12) {
          // // // open main recipe_list
          el_id = el.id.substring(8);
          open_list_item(arr, el_id);
          return;
        }
        // // // if list is emty create new element
        if (emty_list_str == recipe.recipe_list[0].name) {
          f_btn_add_or_edit();
        }
      })
    );
}
function open_list_item(arr, el_id) {
  unhide_id('btn_fav_etc');
  unhide_id('content__recipe_page');
  hide_content_box('hide');
  h1_name(arr[el_id].name);
  f_recipe_page_fill_content(arr, el_id);
  recipe_page_active = true;
}

// // // Show Hide Content Box
function hide_content_box(hide) {
  if (hide == 'hide') {
    hide_id('div_menulist');
    hide_id('div_weekly_plan');
    hide_id('div_menulist_fav');
    hide_id('content__scroll_shoppinglist');
  }
  if (hide == 'unhide') {
    unhide_id('div_menulist');
    unhide_id('div_weekly_plan');
    unhide_id('div_menulist_fav');
    unhide_id('content__scroll_shoppinglist');
  }
}
//////////////////////////////////////////////////////////////////////////////////
// // // Get ID of Trash Listitem
const input_trash_icon = arr => {
  document.querySelectorAll('.input_trash_icon').forEach(el =>
    el.addEventListener('click', function () {
      console.log(arr);
      let el_id = el.id.substring(5, el.id.length);
      // delete item from arr
      arr.ingredients.splice(el_id, 1);
      ingredients_show_box.innerHTML = ' ';
      for (let i = 0; i < arr.ingredients.length; i++) {
        ingredient_fill_p(arr.ingredients[i], ingredients_show_box, i);
      }
      input_trash_icon(arr);
      input_edit_icon_opacity();
    })
  );
};
//////////////////////////////////////////////////////////////////////////////////
// // // Get ID Swap Listitem
let first_swap_element_id;
const swap_icon = arr => {
  document.querySelectorAll('.swap_icon').forEach(el =>
    el.addEventListener('click', function () {
      let el_id = el.id.substring(5, el.id.length);
      document.querySelector('#swap_0').classList.remove('btn_fav_active');
      console.log(el.id);
      let second_swap_element_id;
      if (first_swap_element_id == undefined) {
        first_swap_element_id = el_id;
        swap_icon_active(el.id);
        return;
      }
      second_swap_element_id = el_id;
      if (second_swap_element_id) {
        [
          arr.ingredients[first_swap_element_id],
          arr.ingredients[second_swap_element_id],
        ] = [
          arr.ingredients[second_swap_element_id],
          arr.ingredients[first_swap_element_id],
        ];
        ingredients_show_box.innerHTML = ' ';
        for (let i = 0; i < arr.ingredients.length; i++) {
          ingredient_fill_p(arr.ingredients[i], ingredients_show_box, i);
        }
        swap_icon(arr);
        input_edit_icon_opacity();
        first_swap_element_id = undefined;
      }
    })
  );
};
function swap_icon_active(id) {
  document.querySelectorAll('.swap_icon').forEach(el => {
    el.classList.add('btn_fav_active');
  });
}
//================================================================================
// // // Fill div with content
//================================================================================
function create_list_div(src, target, id) {
  const div_target = document.querySelector(target);
  div_target.innerHTML = '';
  let i = 0;
  src.forEach(el => {
    div_target.innerHTML +=
      '<li class="content__menulist_item" id="' + id + i + '"></li>';
    i++;
  });
}
function fill_list_div(src, id) {
  let i = 0;
  src.forEach(el => {
    let id_input = id + i;
    let name = 'src[' + i + '].name';
    document.getElementById(id_input).innerHTML = eval(name);
    i++;
  });
}
function f_fill_div(src, target, id) {
  create_list_div(src, target, id);
  fill_list_div(src, id);
  load_list_query(src, recipe.recipe_list); // load butten recipe or recipe_fav
}

//================================================================================

//////////////////////////////////////////////////////////////////////////////////
// // // RecipePage show fill content
//////////////////////////////////////////////////////////////////////////////////
function f_recipe_page_fill_content(list_src, i_recipe) {
  // // // change name h1
  actual_recipe_i = Number(i_recipe);
  h1_name(list_src[i_recipe].name);
  // // // check actual_recipe if favorit , if not remove yellow class
  list_src[i_recipe].fav == false
    ? navbar__fav_on_off.classList.remove('btn_fav_active')
    : navbar__fav_on_off.classList.add('btn_fav_active');
  // // // Clear HTML List befor fill
  const content_ingredients_box = document.querySelector(
    '#content_ingredients_box'
  );
  content_ingredients_box.innerHTML = '';
  // // // Clear HTML preperation befor fill
  const list_preperation = document.querySelector('#content__ar_preparation');
  list_preperation.innerHTML = '';
  // // // fill ingredients for each of ingredients array call => fill paragraph
  for (i = 0; i < list_src[i_recipe].ingredients.length; ++i) {
    ingredient_fill_p(
      list_src[i_recipe].ingredients[i],
      content_ingredients_box,
      i
    ); //Recipe Page
  }
  preparation_fill_p(recipe.recipe_list[i_recipe].preparation);
}
//================================================================================
// // // fill paragraph with ingredient content
const ingredient_fill_p = (arr, target, index) => {
  let ingredient, p2;
  // // // delete btn & swap order EXAMPLE
  let trash_id = 'trash' + index;
  let swap_id = 'swap_' + index;
  target.innerHTML +=
    '<ion-icon id="' +
    trash_id +
    '" class="input_edit_icon input_trash_icon trash_icon icon_opacity" name="trash-outline"></ion-icon>';
  for (let j = 0; j < 3; j++) {
    p2 = j == 1 ? '<p class=grid_number>' : '<p>';
    ingredient = arr[j];
    target.innerHTML += p2 + ingredient + '</p>';
  }
  target.innerHTML +=
    '<ion-icon id="' +
    swap_id +
    '" class="input_edit_icon swap_icon grid_swap_order icon_opacity" name="swap-vertical-outline"></ion-icon>';
};
// // // fill paragrap of preperation with content
const preparation_fill_p = text => {
  document.querySelector('#content__ar_preparation').innerHTML =
    ' <p>' + line_break_html(text) + '</p>';
};

// line_break_html('R abcRc\nbrb arc');
function line_break_html(str) {
  str = str.replace(/\n/g, '<br/>');
  return str;
}
//////////////////////////////////////////////////////////////////////////////////
// // // RecipePage Toogle Favorit + Weeklyplan + Shoopinglist
//////////////////////////////////////////////////////////////////////////////////
navbar__fav_on_off.addEventListener('click', function () {
  const i = f_check_index_recipe_or_fav();
  btn_active(navbar__fav_on_off);
  if (recipe.recipe_list[i].fav == true) {
    recipe.recipe_list[i].fav = false;
    navbar__fav_on_off.classList.remove('btn_fav_active');
  } else {
    recipe.recipe_list[i].fav = true;
    navbar__fav_on_off.classList.add('btn_fav_active');
  }
  update_or_create_list_at_localstorage(local_list_name, recipe);
});
//////////////////////////////////////////////////////////////////////////////////
// // // RecipePage edit Element
//////////////////////////////////////////////////////////////////////////////////
// // // Input Fields of Editpage fill with Content
const input_fill_with_content = new_obj => {
  h1_name(new_obj.name);
  recipe_name.value = new_obj.name;
  // Ingredients input fill with value
  for (let i = 0; i < new_obj.ingredients.length; i++) {
    ingredient_fill_p(new_obj.ingredients[i], ingredients_show_box, i); //Input Page
  }
  //////////////////////////////////////////////////////////
  ingredients_show_box.classList.remove('hide');
  // // // Preperation input fill with value
  preperation.value = new_obj.preparation;
};

// // // delete list item
function delete_list_item(i) {
  recipe.recipe_list.splice(i, 1);
  update_or_create_list_at_localstorage(local_list_name, recipe);
  location.reload();
}
//////////////////////////////////////////////////////////////////////////////////
// // // Trash + Swap Unhide
const input_edit_icon_opacity = () =>
  document.querySelectorAll('.input_edit_icon').forEach(el => {
    el.classList.remove('icon_opacity');
  });
//////////////////////////////////////////////////////////////////////////////////
// // // LocalStorage List Functions
//////////////////////////////////////////////////////////////////////////////////
// check if list is at localstorage if not create path
const get_local_list = read_list_str_to_obj(local_list_name);
if (get_local_list == null) {
  emty_list_obj.name = emty_list_str;
  recipe.recipe_list = [emty_list_obj];
  f_fill_div(recipe.recipe_list, 'menulist');
  localStorage.setItem(local_list_name, JSON.stringify(recipe));
} else {
  recipe = get_local_list;

  f_fill_div(recipe.recipe_list, '#div_ar_menulist', 'menulist');
  recipe_create_fav(recipe.recipe_list);
}

// // // create new locale file by using liste name
function update_or_create_list_at_localstorage(name, obj) {
  recipe.recipe_list.sort(sort_array_alphabetic);
  recipe_create_fav(recipe.recipe_list);
  localStorage.setItem(name, JSON.stringify(obj));
  f_fill_div(recipe.recipe_list, '#div_ar_menulist', 'menulist');
}
// // // delete list by name from_loacalstorage
function delete_list_from_loacalstorage(name) {
  localStorage.removeItem(name);
}

// // // read local file str to obj
function read_list_str_to_obj(name) {
  const obj_list = JSON.parse(localStorage.getItem(name));
  return obj_list;
}

// // // swap order => swap_list_order(example_list.Pizza.ingredients,1,2)
function swap_list_order(path, count_item1, count_item2) {
  let temp_path = path[count_item1];
  path.splice(count_item1, 1, path[count_item2]);
  path.splice(count_item2, 1, temp_path);
}
// // // add item to list
function add_item_to_list(path, item_name) {
  path.push(item_name);
}

//================================================================================
// // Import Export File
//================================================================================
// // // Save to Downloads as txt
// // // export_to_downloads(recipe, 'Meine Liste');
function export_to_downloads(obj, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(obj, null, 2)], {
      type: 'text/plain',
    })
  );
  a.setAttribute('download', filename + '.txt');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  alert('File saved in Downloads !');
}
////////////////////////////////////////////////////////////////////
// File Picker import local File
let loacal_import_file;
btn_load_list_from_txt_file.addEventListener('click', async () => {
  console.log('OK');
  if (
    confirm(
      'Sie müssen Ihre aktuelle Liste speichern sonst gehen die Daten verloren! \n Trotzdem weiter ?'
    )
  ) {
    //   export_to_downloads(recipe, local_list_name);
    //   if (confirm('Jetzt laden ?')) {
    //     [loacal_import_file] = await window.showOpenFilePicker();
    //     const file = await loacal_import_file.getFile();
    //     const contents = await file.text();
    //     const json_file = await JSON.parse(contents);
    //     console.log(json_file);
    //   }
    // } else {
    if (confirm('Laden der Liste fortsetzen ?')) {
      [loacal_import_file] = await window.showOpenFilePicker();
      const file = await loacal_import_file.getFile();
      const contents = await file.text();
      const json_file = await JSON.parse(contents);
      console.log(json_file);
    }
  }
});
//================================================================================

//////////////////////////////////////////////////////////////////////////////////
// // // Sort Array alphabetically
function sort_array_alphabetic(a, b) {
  a = a.name;
  b = b.name;
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

//////////////////////////////////////////////////////////////////////////////////
// // // Swipe Event = Touchmove
//////////////////////////////////////////////////////////////////////////////////
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function checkDirection() {
  const min_distance = 80;
  const min_distance_le_ri = 50;
  // // // Left ? Right
  // // // go right
  if (touchendX < touchstartX && touchstartX - touchendX > min_distance_le_ri) {
    menu_go_right();
    swipe_prev_recipe(recipe.recipe_list, actual_recipe_i);
  }
  // // // go left
  if (touchendX > touchstartX && touchendX - touchstartX > min_distance_le_ri) {
    menu_go_left();
    swipe_next_recipe(recipe.recipe_list, actual_recipe_i);
  }
  // // // Up ? Down
  // // // go down (swipe up)
  if (touchendY < touchstartY && touchstartY - touchendY > min_distance) {
    // swipe_prev_recipe(recipe.recipe_list, actual_recipe_i);
  }
  // // // go up (swipe up)
  if (touchendY > touchstartY && touchendY - touchstartY > min_distance) {
    // swipe_next_recipe(recipe.recipe_list, actual_recipe_i);
  }
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
  touchstartY = e.changedTouches[0].screenY;
  // console.log('Y:', touchstartY);
});
document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  touchendY = e.changedTouches[0].screenY;
  // console.log('X end:', touchendX);
  checkDirection();
});
//////////////////////////////////////////////////////////////////////////////////
// // // Swipe function go up or down
function swipe_next_recipe(arr, i) {
  if (recipe_page_active == true && recipe_edit_page_active == false) {
    1 <= i ? f_recipe_page_fill_content(arr, i - 1) : console.log('stop');
  }
}
function swipe_prev_recipe(arr, i) {
  if (recipe_page_active == true && recipe_edit_page_active == false) {
    arr.length - 1 > i
      ? f_recipe_page_fill_content(arr, i + 1)
      : console.log('Ende');
  }
}
function menu_go_right() {
  let page = content_page.classList;
  if (recipe_page_active == false && recipe_edit_page_active == false) {
    if (page.contains('content_page_1')) {
      add_remove_page_classlist('content_page_1', 'content_page_2');
      return;
    }
    if (page.contains('content_page_2')) {
      add_remove_page_classlist('content_page_2', 'content_page_3');
      return;
    }
    if (page.contains('content_page_3')) {
      add_remove_page_classlist('content_page_3', 'content_page_4');
      return;
    }
    if (page.contains('content_page_4')) {
      swipe_end(content_page);
      return;
    }
  }
}
function menu_go_left() {
  let page = content_page.classList;
  if (recipe_page_active == false && recipe_edit_page_active == false) {
    if (page.contains('content_page_1')) {
      swipe_end(content_page);
      return;
    }
    if (page.contains('content_page_2')) {
      add_remove_page_classlist('content_page_2', 'content_page_1');
      return;
    }
    if (page.contains('content_page_3')) {
      add_remove_page_classlist('content_page_3', 'content_page_2');
      return;
    }
    if (page.contains('content_page_4')) {
      add_remove_page_classlist('content_page_4', 'content_page_3');
      return;
    }
  }
}
function swipe_end(page) {
  if (page.classList.contains('content_page_4')) {
    page.classList.add('content_page_end');
  }
  if (page.classList.contains('content_page_1')) {
    page.classList.add('content_page_start');
  }
  setTimeout(page => {
    content_page.classList.remove('content_page_start');
    content_page.classList.remove('content_page_end');
  }, 100);
}
function add_remove_page_classlist(page_actual, page_target) {
  content_page.classList.remove(page_actual);
  content_page.classList.add(page_target);
  update_h1_and_nav_icon(content_page);
}
function update_h1_and_nav_icon(page) {
  if (page.classList.contains('content_page_1')) {
    h1_name('Gerichte');
    navbar_current_icon_switch_to(btn_recipe);
  }
  if (page.classList.contains('content_page_2')) {
    h1_name('Wochenplan');
    navbar_current_icon_switch_to(btn_weekly_plan);
  }
  if (page.classList.contains('content_page_3')) {
    h1_name('Favoriten');
    navbar_current_icon_switch_to(btn_fav);
  }
  if (page.classList.contains('content_page_4')) {
    h1_name('Einkaufsliste');
    navbar_current_icon_switch_to(btn_shoppinglist);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// // // Search
//////////////////////////////////////////////////////////////////////////////////
// // // // // // Search box input event
// // // // recipe_name.addEventListener('input', function () {
// // // // console.log('input');
// // // // });
